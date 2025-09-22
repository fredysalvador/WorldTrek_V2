using Microsoft.AspNetCore.Mvc;
using WorldTrek.Services;
using WorldTrek.Models;
using FirebaseAdmin.Auth;

namespace WorldTrek.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly FirebaseService _firebaseService;
        private readonly PasswordService _passwordService;

        public AuthController(FirebaseService firebaseService, PasswordService passwordService)
        {
            _firebaseService = firebaseService;
            _passwordService = passwordService;
        }

        // Registro de usuario
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var userRecord = await _firebaseService.CreateUserAsync(request.Email, request.Password);
                var passwordHash = _passwordService.HashPassword(request.Password);

                var user = new Users
                {
                    Id = userRecord.Uid,
                    Email = request.Email,
                    Name = request.Name,
                    CreatedAt = DateTime.UtcNow,
                    PasswordHash = passwordHash
                };

                await _firebaseService.SaveUserProfileAsync(userRecord.Uid, user);

                return Ok(new
                {
                    message = "Usuario registrado exitosamente",
                    userId = userRecord.Uid,
                    email = request.Email,
                    name = request.Name
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al registrar usuario", error = ex.Message });
            }
        }

        // Login de usuario
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var users = await _firebaseService.GetAllUsersAsync();
                var user = users.FirstOrDefault(u => u.Email == request.Email);

                if (user == null)
                    return Unauthorized(new { message = "Email no encontrado" });

                if (!_passwordService.VerifyPassword(request.Password, user.PasswordHash))
                    return Unauthorized(new { message = "Contraseña inválida" });

                return Ok(new
                {
                    message = "Login exitoso",
                    user = new { user.Id, user.Email, user.Name, user.PasswordHash },
                    token = $"token-{user.Id}" // token simulado
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error en el login", error = ex.Message });
            }
        }

        // Verificación de token
        [HttpPost("verify-token")]
        public async Task<IActionResult> VerifyToken([FromBody] TokenRequest request)
        {
            try
            {
                var uid = await _firebaseService.VerifyTokenAsync(request.IdToken);
                if (uid == null)
                    return Unauthorized(new { message = "Token inválido" });

                var user = await _firebaseService.GetUserProfileAsync<Users>(uid);
                return Ok(new
                {
                    message = "Token válido",
                    userId = uid,
                    user = user
                });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = "Error al verificar token", error = ex.Message });
            }
        }

        // Obtener usuario por ID
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUser(string userId)
        {
            try
            {
                var user = await _firebaseService.GetUserProfileAsync<Users>(userId);
                if (user == null)
                    return NotFound(new { message = "Usuario no encontrado" });

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener usuario", error = ex.Message });
            }
        }

        // Actualizar perfil (nombre, correo, contraseña)
        [HttpPut("user/{userId}")]
        public async Task<IActionResult> UpdateUser(string userId, [FromBody] UpdateUserDto dto)
        {
            try
            {
                var existingUser = await _firebaseService.GetUserProfileAsync<Users>(userId);
                if (existingUser == null)
                    return NotFound(new { message = "Usuario no encontrado" });

                if (!string.IsNullOrWhiteSpace(dto.Name))
                    existingUser.Name = dto.Name;

                if (!string.IsNullOrWhiteSpace(dto.Email))
                    existingUser.Email = dto.Email;

                if (!string.IsNullOrWhiteSpace(dto.Password))
                    existingUser.PasswordHash = _passwordService.HashPassword(dto.Password);

                await _firebaseService.SaveUserProfileAsync(userId, existingUser);

                return Ok(new { message = "Perfil actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al actualizar perfil", error = ex.Message });
            }
        }
    }

    // DTOs
    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
    }

    public class TokenRequest
    {
        public string IdToken { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UpdateUserDto
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
    }
}
