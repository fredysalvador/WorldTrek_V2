using WorldTrek.Services;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
            policy =>
            {
                policy
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
            });
});
builder.Services.AddSingleton<FirebaseService>();
//Validacion de credenciales
builder.Services.AddSingleton<PasswordService>();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");  // ← CORS antes que Authorization y MapControllers
app.UseAuthorization();

app.MapControllers();     // ← después de UseCors
app.UseDefaultFiles();
app.UseStaticFiles(); // ya debe estar

// Redirigir cualquier ruta que empiece con /app a index.html de Angular
app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/app") &&
        !System.IO.Path.HasExtension(context.Request.Path.Value))
    {
        context.Request.Path = "/app/index.html";
    }
    await next();
});

app.Run();
