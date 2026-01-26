using AdminServiceDotNET.Dtos;

namespace AdminServiceDotNET.Service
{
    public interface IBatchService
    {
        Task<IEnumerable<BatchDto>> GetAllBatchesAsync();
        Task<BatchDto?> GetBatchByIdAsync(long id);
        Task CreateBatchAsync(BatchDto batchDto);
        Task UpdateBatchAsync(long id, BatchDto batchDto);
        Task DeleteBatchAsync(long id);
    }
}
