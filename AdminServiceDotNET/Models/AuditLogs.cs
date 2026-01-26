using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminServiceDotNET.Models
{
    [Table("audit_logs")]
    public class AuditLogs
    {
        [Key]
        [Column("log_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public long Id { get; set; }

        [Required]
        [Column("service_name")]
        [MaxLength(50)]
        public ServiceName ServiceName { get; set; }

        [Required]
        [Column("action_name")]
        [MaxLength(50)]
        public  AuditAction Action { get; set; }

        
        [Column("user_email")]
        [Required]
        [MaxLength(150)]
        public string UserEmail { get; set; }

        [Required]
        [Column("user_role")]
        [MaxLength(50)]
        public UserRole Role { get; set; }

        [Column("details")]
        public string Details { get; set; }

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
