using AdminServiceDotNET.Dtos;
using System.Security.Claims;

namespace AdminServiceDotNET.Service
{
    public interface IAnnouncementService
    {
        Task<IEnumerable<AnnouncementDto>> GetAllAnnouncementsAsync();
        Task CreateAnnouncementAsync(CreateAnnouncementDto dto, ClaimsPrincipal user);
        Task DeleteAnnouncementAsync(long id);
    }
}
