using AdminServiceDotNET.Models;

namespace AdminServiceDotNET.Data
{
    public interface IBatchRepository
    {
        Task<IEnumerable<Batch>> GetAllAsync();
        Task<Batch?> GetByIdAsync(long id);
        Task AddAsync(Batch batch);
        Task UpdateAsync(Batch batch);
        Task DeleteAsync(long id);
    }
}
