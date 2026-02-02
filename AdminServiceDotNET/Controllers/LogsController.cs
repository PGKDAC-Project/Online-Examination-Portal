using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AdminServiceDotNET.Service;
using AdminServiceDotNET.Models;
using AdminServiceDotNET.Dtos;
using System.Linq;

namespace AdminServiceDotNET.Controllers
{
    [ApiController]
    [Route("admin/logs")]
    [Authorize(Roles = "ROLE_ADMIN")]
    public class LogsController : ControllerBase
    {
        private readonly IAuditLogService service;

        public LogsController(IAuditLogService service)
        {
            this.service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuditLogDto>>> GetLogs()
        {
            var logs = await service.GetAllLogsAsync();
            var dtos = logs.Select(l => new AuditLogDto
            {
                Id = l.Id,
                Time = l.CreatedAt,
                User = l.UserEmail,
                Role = l.Role.ToString(),
                Action = l.Action.ToString().Replace("_", " "),
                ServiceName = l.ServiceName.ToString().Replace("_", " "),
                Status = "Success",
                Details = l.Details
            });
            return Ok(dtos);
        }
        
        [HttpPost]
        [Route("/api/audit-logs")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateAuditLog([FromBody] AuditLogCreateDto dto)
        {
            await service.CreateLogAsync(dto);
            return Ok();
        }
    }
}
