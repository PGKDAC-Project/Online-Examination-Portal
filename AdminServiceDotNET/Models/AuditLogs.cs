using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminServiceDotNET.Models
{
    [Table("audit_logs")]
    public class AuditLogs
    {
        [Key]
        [Column("log_id")]
        [Required]
        public string Id { get; set; }

        [Required]
        [Column("service_name")]
        public ServiceName ServiceName { get; set; }

        [Required]
        [Column("action_name")]
        public  AuditAction Action { get; set; }

        
        [Column("user_email")]
        [Required]
        [MaxLength(150)]
        public string userEmail { get; set; }

        [Required]
        [Column("user_role")]
        [MaxLength(50)]
        public UserRole Role { get; set; }
        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
