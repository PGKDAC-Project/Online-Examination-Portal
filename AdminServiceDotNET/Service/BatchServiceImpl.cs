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
                StartDate = b.StartDate,
                EndDate = b.EndDate,
                StartDateString = b.StartDate.ToString("yyyy-MM"),
                EndDateString = b.EndDate.ToString("yyyy-MM"),
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
                StartDate = b.StartDate,
                EndDate = b.EndDate,
                StartDateString = b.StartDate.ToString("yyyy-MM"),
                EndDateString = b.EndDate.ToString("yyyy-MM"),
                Status = b.EndDate >= DateTime.Now ? "Active" : "Completed"
            };
        }

        public async Task CreateBatchAsync(BatchDto dto)
        {
            // Parse dates from string format (YYYY-MM)
            DateTime startDate = DateTime.Parse(dto.StartDateString + "-01");
            DateTime endDate = DateTime.Parse(dto.EndDateString + "-01");
            
            var batch = new Batch
            {
                BatchName = dto.BatchName,
                StartDate = startDate,
                EndDate = endDate
            };
            await batchRepository.AddAsync(batch);
        }

        public async Task UpdateBatchAsync(long id, BatchDto dto)
        {
            var b = await batchRepository.GetByIdAsync(id);
            if (b != null)
            {
                b.BatchName = dto.BatchName;
                
                // Parse dates from string if provided
                if (!string.IsNullOrEmpty(dto.StartDateString))
                {
                    b.StartDate = DateTime.Parse(dto.StartDateString + "-01");
                }
                if (!string.IsNullOrEmpty(dto.EndDateString))
                {
                    b.EndDate = DateTime.Parse(dto.EndDateString + "-01");
                }
                
                await batchRepository.UpdateAsync(b);
            }
        }

        public async Task DeleteBatchAsync(long id)
        {
            await batchRepository.DeleteAsync(id);
        }
    }
}
