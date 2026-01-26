using AdminServiceDotNET.Models;
using Microsoft.EntityFrameworkCore;

namespace AdminServiceDotNET.Data
{
    public class AnnouncementRepositoryImpl : IAnnouncementRepository
    {
        private readonly AdminDbContext _context;

        public AnnouncementRepositoryImpl(AdminDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Announcement>> GetAllAsync()
        {
            return await _context.Announcements.ToListAsync();
        }

        public async Task<Announcement?> GetByIdAsync(long id)
        {
            return await _context.Announcements.FindAsync(id);
        }

        public async Task AddAsync(Announcement announcement)
        {
            await _context.Announcements.AddAsync(announcement);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(long id)
        {
            var announcement = await GetByIdAsync(id);
            if (announcement != null)
            {
                _context.Announcements.Remove(announcement);
                await _context.SaveChangesAsync();
            }
        }
    }
}
