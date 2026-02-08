using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AdminServiceDotNET.Dtos;
using AdminServiceDotNET.Service;
using AdminServiceDotNET.Models;

namespace AdminServiceDotNET.Controllers
{
    [ApiController]
    [Route("admin/batches")]
    public class BatchController : BaseController
    {
        private readonly IBatchService batchService;
        private readonly IAuditLogService auditLogService;

        public BatchController(IBatchService batchService, IAuditLogService auditLogService)
        {
            this.batchService = batchService;
            this.auditLogService = auditLogService;
        }

        [HttpGet]
        [Authorize(Roles = "ROLE_ADMIN,ROLE_INSTRUCTOR,ROLE_STUDENT")]
        public async Task<ActionResult<IEnumerable<BatchDto>>> GetBatches()
        {
            try
            {
                var batches = await batchService.GetAllBatchesAsync();
                return Ok(batches);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting batches: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "ROLE_ADMIN,ROLE_INSTRUCTOR,ROLE_STUDENT")]
        public async Task<ActionResult<BatchDto>> GetBatch(long id)
        {
            var batch = await batchService.GetBatchByIdAsync(id);
            return batch == null ? NotFound() : Ok(batch);
        }

        [HttpPost]
        [Authorize(Roles = "ROLE_ADMIN")]
        public async Task<ActionResult<ApiResponse>> CreateBatch(BatchDto dto)
        {
            await batchService.CreateBatchAsync(dto);
            await auditLogService.LogAsync(ServiceName.BATCH_SERVICE, 
                                            GetUserEmail(), 
                                            UserRole.ROLE_ADMIN, 
                                            AuditAction.CREATE_BATCH, 
                                            $"Created batch {dto.BatchName}");
            return Ok(new ApiResponse { Status = 201, Message = "Batch created successfully" });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "ROLE_ADMIN")]
        public async Task<ActionResult<ApiResponse>> UpdateBatch(long id, BatchDto dto)
        {
            await batchService.UpdateBatchAsync(id, dto);
            await auditLogService.LogAsync(ServiceName.BATCH_SERVICE, 
                                            GetUserEmail(), 
                                            UserRole.ROLE_ADMIN, 
                                            AuditAction.UPDATE_USER, 
                                            $"Updated batch {id}");
            return Ok(new ApiResponse { Status = 200, Message = "Batch updated successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ROLE_ADMIN")]
        public async Task<ActionResult<ApiResponse>> DeleteBatch(long id)
        {
            await batchService.DeleteBatchAsync(id);
            await auditLogService.LogAsync(ServiceName.BATCH_SERVICE, 
                                            GetUserEmail(), 
                                            UserRole.ROLE_ADMIN,
                                            AuditAction.DELETE_USER,
                                            $"Deleted batch {id}");
            return Ok(new ApiResponse { Status = 200, Message = "Batch deleted successfully" });
        }
    }
}
