using AdminServiceDotNET.Dtos;
using AdminServiceDotNET.Service;
using AdminServiceDotNET.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AdminServiceDotNET.Controllers
{
    [ApiController]
    [Route("admin/settings")]
    public class SystemSettingsController : BaseController
    {
        private readonly ISystemSettingsService systemSettingService;
        private readonly IAuditLogService auditLogService;

        public SystemSettingsController(ISystemSettingsService service, IAuditLogService auditLogService)
        {
            systemSettingService = service;
            this.auditLogService = auditLogService;
        }

        [HttpGet]
        [Authorize(Roles = "ROLE_ADMIN,ROLE_INSTRUCTOR,ROLE_STUDENT")]
        public async Task<ActionResult<SystemSettingsDto>> GetSettings()
        {
            return Ok(await systemSettingService.GetSettingsAsync());
        }

        [HttpPut]
        [Authorize(Roles = "ROLE_ADMIN")]
        public async Task<ActionResult<ApiResponse>> UpdateSettings(SystemSettingsDto dto)
        {
            await systemSettingService.UpdateSettingsAsync(dto);
            await auditLogService.LogAsync(ServiceName.SYSTEM_SERVICE, 
                                            GetUserEmail(), 
                                            UserRole.ROLE_ADMIN, 
                                            AuditAction.LOGIN, 
                                            $"Updated system settings");
            return Ok(new ApiResponse { Status = 200, Message = "Settings updated successfully" });
        }
    }
}
