using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AdminServiceDotNET.Dtos;
using AdminServiceDotNET.Service;
using AdminServiceDotNET.Models;

namespace AdminServiceDotNET.Controllers
{
    [ApiController]
    [Route("admin/announcements")]
    public class AnnouncementController : ControllerBase
    {
        private readonly IAnnouncementService announcementService;
        private readonly IAuditLogService auditLogService;

        public AnnouncementController(IAnnouncementService service, IAuditLogService auditLogService)
        {
            announcementService = service;
            this.auditLogService = auditLogService;
        }

        [HttpGet]
        [Authorize(Roles = "ROLE_ADMIN,ROLE_STUDENT,ROLE_INSTRUCTOR")]
        public async Task<ActionResult<IEnumerable<AnnouncementDto>>> GetAnnouncements()
        {
            var list = await announcementService.GetAllAnnouncementsAsync();
            return Ok(list);
        }

        [HttpPost]
        [Authorize(Roles = "ROLE_ADMIN")]
        public async Task<ActionResult<ApiResponse>> CreateAnnouncement(AnnouncementDto dto)
        {
            await announcementService.CreateAnnouncementAsync(dto);
            await auditLogService.LogAsync(
                                            ServiceName.ANNOUNCEMENT_SERVICE, 
                                            User.Identity?.Name ?? "Admin", 
                                            UserRole.ROLE_ADMIN, 
                                            AuditAction.POST_ANNOUNCEMENT, 
                                            $"Posted announcement {dto.Title}"
                                            );
            return Ok(new ApiResponse { Status = 201, Message = "Announcement created successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ROLE_ADMIN")]
        public async Task<ActionResult<ApiResponse>> DeleteAnnouncement(long id)
        {
            await announcementService.DeleteAnnouncementAsync(id);
            await auditLogService.LogAsync(ServiceName.ANNOUNCEMENT_SERVICE, 
                                            User.Identity?.Name ?? "Admin", 
                                            UserRole.ROLE_ADMIN, 
                                            AuditAction.DELETE_USER, 
                                            $"Deleted announcement {id}");
            return Ok(new ApiResponse { Status = 200, Message = "Announcement deleted successfully" });
        }
    }
}
