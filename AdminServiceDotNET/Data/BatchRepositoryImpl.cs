using AdminServiceDotNET.Models;
using Microsoft.EntityFrameworkCore;

namespace AdminServiceDotNET.Data
{
    public class BatchRepositoryImpl : IBatchRepository
    {
        private readonly AdminDbContext _context;

        public BatchRepositoryImpl(AdminDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Batch>> GetAllAsync()
        {
            return await _context.Batches.ToListAsync();
        }

        public async Task<Batch?> GetByIdAsync(long id)
        {
            return await _context.Batches.FindAsync(id);
        }

        public async Task AddAsync(Batch batch)
        {
            await _context.Batches.AddAsync(batch);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Batch batch)
        {
            _context.Batches.Update(batch);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(long id)
        {
            var batch = await GetByIdAsync(id);
            if (batch != null)
            {
                _context.Batches.Remove(batch);
                await _context.SaveChangesAsync();
            }
        }
    }
}
