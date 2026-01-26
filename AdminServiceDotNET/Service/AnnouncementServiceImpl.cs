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
                Description = a.Message,
                Message = a.Message,
                CreatedByEmail = a.CreatedByEmail,
                CreatedByRole = a.CreatedByRole.ToString(),
                TargetRole = a.TargetRole.ToString().Replace("ROLE_", ""),
                IsActive = a.IsActive,
                ExpiresAt = a.ExpiresAt,
                ExpiryDate = a.ExpiresAt?.ToString("yyyy-MM-dd"),
                CreatedAt = a.CreatedAt,
                Date = a.CreatedAt.ToString("MMM dd, yyyy")
            });
        }

        public async Task CreateAnnouncementAsync(AnnouncementDto dto)
        {
            // Map Description to Message if Message is null
            string message = string.IsNullOrEmpty(dto.Message) ? dto.Description : dto.Message;
            
            // Parse expiry date if provided
            DateTime? expiresAt = null;
            if (!string.IsNullOrEmpty(dto.ExpiryDate))
            {
                if (DateTime.TryParse(dto.ExpiryDate, out DateTime parsed))
                {
                    expiresAt = parsed;
                }
            }
            
            // Parse target role - handle both "Student" and "ROLE_STUDENT" formats
            string targetRoleStr = dto.TargetRole;
            if (!targetRoleStr.StartsWith("ROLE_"))
            {
                targetRoleStr = "ROLE_" + targetRoleStr.ToUpper();
            }
            
            var announcement = new Announcement
            {
                Title = dto.Title,
                Message = message,
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
