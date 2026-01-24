using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
namespace AdminServiceDotNET.Models
{
    [Table("announcements")]
    [Index(nameof(CreatedAt), Name = "idx_announcement_created_at")]
    [Index(nameof(TargetRole), Name = "idx_announcement_target_role")]
    public class Announcement
    {
        [Key]
        [Column("announcement_id")]
        public long Id { get; set; }

        [Required]
        [Column("title")]
        [MaxLength(150)]
        public string Title { get; set; }

        [Required]
        [Column("message", TypeName = "text")]
        public string Message { get; set; }

        // Created by (admin or instructor email)
        [Required]
        [Column("created_by_email")]
        [MaxLength(150)]
        public string CreatedByEmail { get; set; }

        [Required]
        [Column("created_by_role")]
        public UserRole CreatedByRole { get; set; }

        [Required]
        [Column("target_role")]
        public UserRole TargetRole { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("expires_at")]
        public DateTime? ExpiresAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

