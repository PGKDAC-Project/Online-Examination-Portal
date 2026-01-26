using AdminServiceDotNET.Dtos;
using AdminServiceDotNET.Service;
using AdminServiceDotNET.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AdminServiceDotNET.Controllers
{
    [ApiController]
    [Route("admin/exams")]
    [Authorize(Roles = "ROLE_ADMIN")]
    public class ExamController : ControllerBase
    {
        private readonly IExamService  service;
        private readonly IAuditLogService  auditLogService;

        public ExamController(IExamService service, IAuditLogService auditLogService)
        {
             this.service = service;
             this.auditLogService = auditLogService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExamDto>>> GetExams()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            return Ok(await  service.GetAllExamsAsync(token));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> DeleteExam(long id)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            await  service.DeleteExamAsync(id, token);
            await  auditLogService.LogAsync(ServiceName.EXAM_SERVICE, 
                                            User.Identity?.Name ?? "Admin", 
                                            UserRole.ROLE_ADMIN, 
                                            AuditAction.DELETE_USER, 
                                            $"Deleted exam {id}");
            return Ok(new ApiResponse { Status = 200, Message = "Exam deleted successfully" });
        }
    }
}
