using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using AdminServiceDotNET.Models;
using System.Text.Json;
using AdminServiceDotNET.Data;
using AdminServiceDotNET.Service;
using Microsoft.EntityFrameworkCore;
using AdminServiceDotNET.Middleware;
using System.Security.Claims;
namespace AdminServiceDotNET
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.WebHost.UseUrls("http://localhost:7097");

            // Add services to the container.

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
                });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

            builder.Services.AddDbContext<AdminDbContext>(options =>
            options.UseMySql(
                builder.Configuration.GetConnectionString("AdminDb"),
                ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("AdminDb"))
                )
            );

            // to register Repositories
            builder.Services.AddScoped<IBatchRepository, BatchRepositoryImpl>();
            builder.Services.AddScoped<IAnnouncementRepository, AnnouncementRepositoryImpl>();
            builder.Services.AddScoped<ISystemSettingsRepository, SystemSettingsRepositoryImpl>();

            //to register Services
            builder.Services.AddHttpClient<IUserService, UserServiceImpl>();
            builder.Services.AddHttpClient<ICourseService, CourseServiceImpl>();
            builder.Services.AddHttpClient<IExamService, ExamServiceImpl>();
            builder.Services.AddScoped<IBatchService, BatchServiceImpl>();
            builder.Services.AddScoped<IAnnouncementService, AnnouncementServiceImpl>();
            builder.Services.AddScoped<ISystemSettingsService, SystemSettingsServiceImpl>();
            builder.Services.AddScoped<IAuditLogService, AuditLogServiceImpl>();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Admin Service API", Version = "v1" });

                // native HTTP Bearer scheme (handles "Bearer " prefix automatically)
                c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description = "Enter only your JWT token (The prefix 'Bearer ' will be added automatically)."
                });

                c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                {
                    {
                        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                        {
                            Reference = new Microsoft.OpenApi.Models.OpenApiReference
                            {
                                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });
            });

            var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "YOUR_VERY_SECRET_KEY_FOR_JWT_AUTHENTICATION";

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    NameClaimType = "sub",
                    RoleClaimType = "user_role",

                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtSecret)
                    )
                };

                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = context =>
                    {
                        var identity = context.Principal?.Identity as ClaimsIdentity;
                        if (identity != null)
                        {
                            var roleClaim = identity.FindFirst("user_role");
                            if (roleClaim != null && !identity.HasClaim(c => c.Type == ClaimTypes.Role))
                            {
                                identity.AddClaim(new Claim(ClaimTypes.Role, roleClaim.Value));
                            }
                        }
                        return Task.CompletedTask;
                    },
                    OnAuthenticationFailed = context =>
                    {
                        Console.WriteLine("Authentication failed: " + context.Exception.Message);
                        return Task.CompletedTask;
                    }
                };
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:5173")
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    });
            });

            var app = builder.Build();
            app.UseCors("AllowFrontend");
            app.UseMiddleware<GlobalExceptionMiddleware>();   //global exception middleware
            app.UseAuthentication(); //authentication middleware
            app.UseAuthorization(); // authorization middleware
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // app.UseHttpsRedirection();

            app.MapControllers();

            app.Run();
        }
    }
}
