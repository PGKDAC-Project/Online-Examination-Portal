using AdminServiceDotNET.Dtos;
using AdminServiceDotNET.Service;
using AdminServiceDotNET.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AdminServiceDotNET.Controllers
{
    [ApiController]
    [Route("admin/courses")]
    [Authorize(Roles = "ROLE_ADMIN")]
    public class CourseController : BaseController
    {
        private readonly ICourseService  courseService;
        private readonly IAuditLogService  auditLogService;

        public CourseController(ICourseService courseService, IAuditLogService auditLogService)
        {
             this.courseService = courseService;
             this.auditLogService = auditLogService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetCourses()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            return Ok(await  courseService.GetAllCoursesAsync(token));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse>> CreateCourse(CourseDto dto)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            await  courseService.CreateCourseAsync(dto, token);
            await  auditLogService.LogAsync(ServiceName.COURSE_SERVICE, 
                                            GetUserEmail(), 
                                            UserRole.ROLE_ADMIN, 
                                            AuditAction.CREATE_COURSE, 
                                            $"Created course {dto.Title}");
            return Ok(new ApiResponse { Status = 201, Message = "Course created successfully" });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse>> UpdateCourse(long id, CourseDto dto)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            await  courseService.UpdateCourseAsync(id, dto, token);
            await  auditLogService.LogAsync(ServiceName.COURSE_SERVICE, 
                                            GetUserEmail(), 
                                            UserRole.ROLE_ADMIN, 
                                            AuditAction.UPDATE_USER, 
                                            $"Updated course {id}");
            return Ok(new ApiResponse { Status = 200, Message = "Course updated successfully" });
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult<ApiResponse>> UpdateStatus(long id, [FromBody] UpdateStatusRequest request)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            await  courseService.UpdateCourseStatusAsync(id, request.Status, token);
             await  auditLogService.LogAsync(ServiceName.COURSE_SERVICE, 
                                             GetUserEmail(), 
                                             UserRole.ROLE_ADMIN, 
                                             AuditAction.UPDATE_USER, 
                                             $"Updated course status {id} to {request.Status}");
            return Ok(new ApiResponse { Status = 200, Message = "Status updated successfully" });
        }

        public class UpdateStatusRequest
        {
            public string Status { get; set; }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> DeleteCourse(long id)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            await  courseService.DeleteCourseAsync(id, token);
            await  auditLogService.LogAsync(ServiceName.COURSE_SERVICE, 
                                            GetUserEmail(), 
                                            UserRole.ROLE_ADMIN, 
                                            AuditAction.DELETE_USER, 
                                            $"Deleted course {id}");
            return Ok(new ApiResponse { Status = 200, Message = "Course deleted successfully" });
        }
    }
}
