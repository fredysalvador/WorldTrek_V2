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

        // Guardar un viaje nuevo
        [HttpPost("{userId}")]
        public async Task<IActionResult> SaveTrip(string userId, [FromBody] Viaje viaje)
        {
            var id = await _firebaseService.SaveTripAsync(userId, viaje);
            return Ok(new { id });
        }

        // Editar un viaje existente
        [HttpPut("{userId}/{tripId}")]
        public async Task<IActionResult> UpdateTrip(string userId, string tripId, [FromBody] Viaje viaje)
        {
            var success = await _firebaseService.UpdateTripAsync(userId, tripId, viaje);
            if (!success) return NotFound();
            return Ok(new { message = "Viaje actualizado correctamente ✅" });
        }

        // Borrar un viaje
        [HttpDelete("{userId}/{tripId}")]
        public async Task<IActionResult> DeleteTrip(string userId, string tripId)
        {
            var success = await _firebaseService.DeleteTripAsync(userId, tripId);
            if (!success) return NotFound();
            return Ok(new { message = "Viaje eliminado correctamente 🗑️" });
        }
    }
}
