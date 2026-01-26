using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AdminServiceDotNET.Service;
using AdminServiceDotNET.Models;

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
        public async Task<ActionResult<IEnumerable<AuditLogs>>> GetLogs()
        {
            return Ok(await service.GetAllLogsAsync());
        }
    }
}
