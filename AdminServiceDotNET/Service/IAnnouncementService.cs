using AdminServiceDotNET.Dtos;

namespace AdminServiceDotNET.Service
{
    public interface IAnnouncementService
    {
        Task<IEnumerable<AnnouncementDto>> GetAllAnnouncementsAsync();
        Task CreateAnnouncementAsync(AnnouncementDto dto);
        Task DeleteAnnouncementAsync(long id);
    }
}
