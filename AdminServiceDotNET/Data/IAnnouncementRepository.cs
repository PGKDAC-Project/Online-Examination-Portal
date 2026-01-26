using AdminServiceDotNET.Models;

namespace AdminServiceDotNET.Data
{
    public interface IAnnouncementRepository
    {
        Task<IEnumerable<Announcement>> GetAllAsync();
        Task<Announcement?> GetByIdAsync(long id);
        Task AddAsync(Announcement announcement);
        Task DeleteAsync(long id);
    }
}
