using AdminServiceDotNET.Dtos;
using AdminServiceDotNET.Models;
using AdminServiceDotNET.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace AdminServiceDotNET.Controllers
{
    [ApiController]
    [Route("admin/users")]
    [Authorize(Roles = "ROLE_ADMIN")]
    public class UserController : ControllerBase
    {
        AdminDbContext dbContext;
        IUserService userService;
        IAuditLogService auditLogService;
        public UserController(AdminDbContext dbContext, IUserService userService, IAuditLogService auditLogService)
        {
            this.dbContext = dbContext;
            this.userService = userService;
            this.auditLogService = auditLogService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var users = await userService.GetAllUsersAsync(token);
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(long id)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var user = await userService.GetUserByIdAsync(id, token);
            return user == null ? NotFound() : Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse>> AddUser(UserDto userDto)
        {
            string token = Request.Headers["Authorization"]
            .ToString()
            .Replace("Bearer ", "");
            await userService.CreateUser(userDto, token);
            await auditLogService.LogAsync(
                ServiceName.USER_SERVICE,
                User.FindFirst("sub")?.Value ?? "unknown",
                UserRole.ROLE_ADMIN,
                AuditAction.CREATE_USER,
                $"Created user {userDto.email}");
            return Ok(new ApiResponse { Status = 200, Message = "User created Successfully." });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse>> UpdateUser(long id, UserDto userDto)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            await userService.UpdateUserAsync(id, userDto, token);
            await auditLogService.LogAsync(
                ServiceName.USER_SERVICE,
                User.FindFirst("sub")?.Value ?? "unknown",
                UserRole.ROLE_ADMIN,
                AuditAction.UPDATE_USER,
                $"Updated user {id}");
            return Ok(new ApiResponse { Status = 200, Message = "User updated Successfully." });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> DeleteUser(long id)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            await userService.DeleteUserAsync(id, token);
            await auditLogService.LogAsync(
                ServiceName.USER_SERVICE,
                User.FindFirst("sub")?.Value ?? "unknown",
                UserRole.ROLE_ADMIN,
                AuditAction.DELETE_USER,
                $"Deleted user {id}");
            return Ok(new ApiResponse { Status = 200, Message = "User deleted Successfully." });
        } 
    }
}
