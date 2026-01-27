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
                Description = a.Description,
                CreatedByEmail = a.CreatedByEmail,
                CreatedByRole = a.CreatedByRole.ToString(),
                TargetRole = a.TargetRole.ToString().Replace("ROLE_", ""),
                IsActive = a.IsActive,
                ExpiresAt = a.ExpiresAt,
                CreatedAt = a.CreatedAt
            });
        }

        public async Task CreateAnnouncementAsync(AnnouncementDto dto)
        {
            // Parse expiry date if provided
            DateTime? expiresAt = dto.ExpiresAt;
            
            // Parse target role - handle both "Student" and "ROLE_STUDENT" formats
            string targetRoleStr = dto.TargetRole;
            if (!targetRoleStr.StartsWith("ROLE_"))
            {
                targetRoleStr = "ROLE_" + targetRoleStr.ToUpper();
            }
            
            var announcement = new Announcement
            {
                Title = dto.Title,
                Description = dto.Description,
                CreatedByEmail = dto.CreatedByEmail ?? "admin@system.com",
                CreatedByRole = UserRole.ROLE_ADMIN,
                TargetRole = Enum.Parse<UserRole>(targetRoleStr, true),
                ExpiresAt = expiresAt,
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
