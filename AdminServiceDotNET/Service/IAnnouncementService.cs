using AdminServiceDotNET.Dtos;
using System.Security.Claims;

namespace AdminServiceDotNET.Service
{
    public interface IAnnouncementService
    {
        Task<IEnumerable<AnnouncementDto>> GetAllAnnouncementsAsync();
        Task<IEnumerable<AnnouncementDto>> GetAnnouncementsByRoleAsync(string userRole);
        Task CreateAnnouncementAsync(CreateAnnouncementDto dto, ClaimsPrincipal user);
        Task DeleteAnnouncementAsync(long id);
    }
}
