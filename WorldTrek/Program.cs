using WorldTrek.Services;

var builder = WebApplication.CreateBuilder(args);

// Servicios
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Servicios propios
builder.Services.AddSingleton<FirebaseService>();
builder.Services.AddSingleton<PasswordService>();

var app = builder.Build();

// Swagger (solo desarrollo)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();

app.MapControllers();

// Servir archivos estáticos de wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// Angular SPA: redirigir rutas /app y subrutas a index.html
app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value;

    // Si la ruta empieza con /app y no es un archivo físico
    if (path.StartsWith("/app") && !System.IO.Path.HasExtension(path))
    {
        context.Request.Path = "/app/index.html";
    }

    await next();
});

app.Run();
