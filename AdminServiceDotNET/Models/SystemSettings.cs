using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminServiceDotNET.Models
{
    [Table("system_settings")]
    public class SystemSettings
    {
        [Key]
        [Column("settings_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Column("maintenance_mode")]
        public bool MaintenanceMode { get; set; } = false;

        [Column("tab_switch_detection")]
        public bool TabSwitchDetection { get; set; } = true;

        [Column("fullscreen_enforcement")]
        public bool FullscreenEnforcement { get; set; } = true;

        [Column("exam_auto_submit")]
        public bool ExamAutoSubmit { get; set; } = true;

        [Column("last_updated")]
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }
}
