using AdminServiceDotNET.Data;
using AdminServiceDotNET.Dtos;
using AdminServiceDotNET.Models;
using System.Security.Claims;

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

        public async Task CreateAnnouncementAsync(CreateAnnouncementDto dto, ClaimsPrincipal user)
        {
            // Debug: Print all available claims
            Console.WriteLine("Available claims:");
            foreach (var claim in user.Claims)
            {
                Console.WriteLine($"  {claim.Type}: {claim.Value}");
            }
            
            // Extract user information from JWT claims - try multiple claim types
            var userEmail = user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                           user.FindFirst("sub")?.Value ?? 
                           user.FindFirst("email")?.Value ?? 
                           user.FindFirst("unique_name")?.Value ?? 
                           user.Identity?.Name;
            
            var userRoleStr = user.FindFirst("user_role")?.Value ?? 
                             user.FindFirst("role")?.Value ?? 
                             user.FindFirst(ClaimTypes.Role)?.Value;
            
            Console.WriteLine($"Debug: userEmail = {userEmail}, userRoleStr = {userRoleStr}");
            
            if (string.IsNullOrEmpty(userEmail))
                throw new UnauthorizedAccessException("User email not found in token");
            
            if (string.IsNullOrEmpty(userRoleStr))
                throw new UnauthorizedAccessException("User role not found in token");

            // Parse creator role
            if (!userRoleStr.StartsWith("ROLE_"))
                userRoleStr = "ROLE_" + userRoleStr.ToUpper();
            
            var creatorRole = Enum.Parse<UserRole>(userRoleStr, true);

            // Parse expiry date if provided
            DateTime? expiresAt = dto.ExpiresAt;
            
            // Parse target role - handle "All", "Student", "Instructor" formats
            string targetRoleStr = dto.TargetRole;
            List<UserRole> targetRoles = new List<UserRole>();
            
            if (string.IsNullOrEmpty(targetRoleStr) || targetRoleStr.ToLower().Equals("all") || targetRoleStr.ToLower().Equals("all users"))
            {
                // For "All Users", create announcements for both students and instructors
                targetRoles.Add(UserRole.ROLE_STUDENT);
                targetRoles.Add(UserRole.ROLE_INSTRUCTOR);
            }
            else
            {
                if (!targetRoleStr.StartsWith("ROLE_"))
                {
                    targetRoleStr = "ROLE_" + targetRoleStr.ToUpper();
                }
                targetRoles.Add(Enum.Parse<UserRole>(targetRoleStr, true));
            }
            
            // Create announcement(s) for each target role
            foreach (var targetRole in targetRoles)
            {
                var announcement = new Announcement
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    CreatedByEmail = userEmail,
                    CreatedByRole = creatorRole,
                    TargetRole = targetRole,
                    ExpiresAt = expiresAt,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };
                await announcementRepository.AddAsync(announcement);
            }
        }

        public async Task DeleteAnnouncementAsync(long id)
        {
            await announcementRepository.DeleteAsync(id);
        }
    }
}
