using Microsoft.AspNetCore.Mvc;
using WorldTrek.Models;
using WorldTrek.Services;

namespace WorldTrek.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TripsController : ControllerBase
    {
        private readonly FirebaseService _firebaseService;

        public TripsController(FirebaseService firebaseService)
        {
            _firebaseService = firebaseService;
        }

        // Obtener todos los viajes de un usuario
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetTrips(string userId)
        {
            var trips = await _firebaseService.GetTripsAsync(userId);
            return Ok(trips);
        }

        // Guardar un viaje nuevo para un usuario
        [HttpPost("{userId}")]
        public async Task<IActionResult> SaveTrip(string userId, [FromBody] Viaje viaje)
        {
            var id = await _firebaseService.SaveTripAsync(userId, viaje);
            return Ok(new { id });
        }
    }
}
