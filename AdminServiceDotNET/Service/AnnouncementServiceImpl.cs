using AdminServiceDotNET.Data;
using AdminServiceDotNET.Dtos;
using AdminServiceDotNET.Models;

namespace AdminServiceDotNET.Service
{
    public class AnnouncementServiceImpl : IAnnouncementService
    {
        private readonly IAnnouncementRepository announcementRepository;

        public AnnouncementServiceImpl(IAnnouncementRepository announcementRepository)
        {
            this.announcementRepository = announcementRepository;
        }

        public async Task<IEnumerable<AnnouncementDto>> GetAllAnnouncementsAsync()
        {
            var announcements = await announcementRepository.GetAllAsync();
            return announcements.Select(a => new AnnouncementDto
            {
                Id = a.Id,
                Title = a.Title,
                Message = a.Message,
                CreatedByEmail = a.CreatedByEmail,
                CreatedByRole = a.CreatedByRole.ToString(),
                TargetRole = a.TargetRole.ToString(),
                IsActive = a.IsActive,
                ExpiresAt = a.ExpiresAt,
                CreatedAt = a.CreatedAt
            });
        }

        public async Task CreateAnnouncementAsync(AnnouncementDto dto)
        {
            var announcement = new Announcement
            {
                Title = dto.Title,
                Message = dto.Message,
                CreatedByEmail = dto.CreatedByEmail,
                CreatedByRole = Enum.Parse<UserRole>(dto.CreatedByRole),
                TargetRole = Enum.Parse<UserRole>(dto.TargetRole),
                ExpiresAt = dto.ExpiresAt,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };
            await announcementRepository.AddAsync(announcement);
        }

        public async Task DeleteAnnouncementAsync(long id)
        {
            await announcementRepository.DeleteAsync(id);
        }
    }
}
