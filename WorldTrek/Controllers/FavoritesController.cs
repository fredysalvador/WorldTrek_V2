using Microsoft.AspNetCore.Mvc;
using WorldTrek.Services;

namespace WorldTrek.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly FirebaseService _firebaseService;

        public FavoritesController(FirebaseService firebaseService)
        {
            _firebaseService = firebaseService;
        }

        [HttpPost("countries/{userId}")]
        public async Task<IActionResult> SaveCountries(string userId, [FromBody] List<string> countries)
        {
            await _firebaseService.SaveFavoriteCountriesAsync(userId, countries);
            return Ok(new { message = "Favoritos guardados correctamente" });
        }

        [HttpGet("countries/{userId}")]
        public async Task<IActionResult> GetCountries(string userId)
        {
            var favorites = await _firebaseService.GetFavoriteCountriesAsync(userId);
            return Ok(favorites);
        }
    }
}
