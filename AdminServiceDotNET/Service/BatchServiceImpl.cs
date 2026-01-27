using AdminServiceDotNET.Data;
using AdminServiceDotNET.Dtos;
using AdminServiceDotNET.Models;

namespace AdminServiceDotNET.Service
{
    public class BatchServiceImpl : IBatchService
    {
        private readonly IBatchRepository batchRepository;
        private readonly IAuditLogService auditLogService;

        public BatchServiceImpl(IBatchRepository batchRepository, IAuditLogService auditLogService)
        {
            this.batchRepository = batchRepository;
            this.auditLogService = auditLogService;
        }

        public async Task<IEnumerable<BatchDto>> GetAllBatchesAsync()
        {
            var batches = await batchRepository.GetAllAsync();
            return batches.Select(b => new BatchDto
            {
                Id = b.Id,
                BatchName = b.BatchName,
                Description = b.Description,
                StartDate = b.StartDate,
                EndDate = b.EndDate,
                Status = b.EndDate >= DateTime.Now ? "Active" : "Completed"
            });
        }

        public async Task<BatchDto?> GetBatchByIdAsync(long id)
        {
            var b = await batchRepository.GetByIdAsync(id);
            return b == null ? null : new BatchDto
            {
                Id = b.Id,
                BatchName = b.BatchName,
                Description = b.Description,
                StartDate = b.StartDate,
                EndDate = b.EndDate,
                Status = b.EndDate >= DateTime.Now ? "Active" : "Completed"
            };
        }

        public async Task CreateBatchAsync(BatchDto dto)
        {
            var batch = new Batch
            {
                BatchName = dto.BatchName,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate
            };
            await batchRepository.AddAsync(batch);
        }

        public async Task UpdateBatchAsync(long id, BatchDto dto)
        {
            var b = await batchRepository.GetByIdAsync(id);
            if (b != null)
            {
                b.BatchName = dto.BatchName;
                b.Description = dto.Description;
                b.StartDate = dto.StartDate;
                b.EndDate = dto.EndDate;
                await batchRepository.UpdateAsync(b);
            }
        }

        public async Task DeleteBatchAsync(long id)
        {
            await batchRepository.DeleteAsync(id);
        }
    }
}
