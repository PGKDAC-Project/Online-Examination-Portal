using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AdminServiceDotNET.Models
{
    [Table("batches")]
    [Index(nameof(BatchName), Name = "idx_batch_batch_name")]
    [Index(nameof(StartDate), Name = "idx_batch_start_date")]
    [Index(nameof(EndDate), Name = "idx_batch_end_date")]
    public class Batch
    {
        [Key]
        [Required]
        [Column("batch_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        [Column("batch_name")]
        [MaxLength(30)]
        public string BatchName { get; set; }

        [Column("description")]
        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        [Column("start_date")]
        public DateTime StartDate { get; set; }

        [Required]
        [Column("end_date")]
        public DateTime EndDate { get; set; }

        [Required]
        [Column("is_active")]
        public bool IsActive { get; set; } = true;
    }
}

