using Microsoft.AspNetCore.Mvc;
using AdminServiceDotNET.Models;
using Microsoft.EntityFrameworkCore;

namespace AdminServiceDotNET.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly AdminDbContext _context;

        public HealthController(AdminDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                // Check database connectivity
                await _context.Database.CanConnectAsync();
                
                var healthStatus = new
                {
                    Status = "Healthy",
                    Timestamp = DateTime.UtcNow,
                    Service = "AdminServiceDotNET",
                    Version = "1.0.0",
                    Database = "Connected",
                    Uptime = Environment.TickCount64
                };

                return Ok(healthStatus);
            }
            catch (Exception ex)
            {
                var healthStatus = new
                {
                    Status = "Unhealthy",
                    Timestamp = DateTime.UtcNow,
                    Service = "AdminServiceDotNET",
                    Version = "1.0.0",
                    Database = "Disconnected",
                    Error = ex.Message,
                    Uptime = Environment.TickCount64
                };

                return StatusCode(503, healthStatus);
            }
        }
    }
}