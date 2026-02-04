using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AdminServiceDotNET.Dtos;
using AdminServiceDotNET.Service;
using AdminServiceDotNET.Models;
using System.Text.Json;

namespace AdminServiceDotNET.Controllers
{
    [ApiController]
    [Route("admin/announcements")]
    [Authorize(Roles = "ROLE_ADMIN")]
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
        public async Task<ActionResult<IEnumerable<AnnouncementDto>>> GetAnnouncements()
        {
            var list = await announcementService.GetAllAnnouncementsAsync();
            return Ok(list);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse>> CreateAnnouncement([FromBody] object requestBody)
        {
            try
            {
                // Parse the request manually to avoid validation issues
                var json = System.Text.Json.JsonSerializer.Serialize(requestBody);
                var dto = System.Text.Json.JsonSerializer.Deserialize<CreateAnnouncementDto>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                
                // Manual validation for required fields only
                if (string.IsNullOrEmpty(dto.Title))
                    return BadRequest(new { status = "ValidationFailed", message = "Title is required" });
                
                if (string.IsNullOrEmpty(dto.Description))
                    return BadRequest(new { status = "ValidationFailed", message = "Description is required" });
                
                await announcementService.CreateAnnouncementAsync(dto, User);
                await auditLogService.LogAsync(
                                                ServiceName.ANNOUNCEMENT_SERVICE, 
                                                User.Identity?.Name ?? "Admin", 
                                                UserRole.ROLE_ADMIN, 
                                                AuditAction.POST_ANNOUNCEMENT, 
                                                $"Posted announcement {dto.Title}"
                                                );
                return Ok(new ApiResponse { Status = 201, Message = "Announcement created successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = "Error", message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
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
