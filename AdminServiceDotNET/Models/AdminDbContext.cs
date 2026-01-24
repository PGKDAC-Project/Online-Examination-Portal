using Microsoft.EntityFrameworkCore;
namespace AdminServiceDotNET.Models
{
    /*    DbContext represents a session with the database.It manages entity mappings, tracks changes,
        applies migrations, and executes SQL queries.In our admin microservice it maps audit logs, 
        batches, and announcements tables.*/
    public class AdminDbContext : DbContext
    {
        public AdminDbContext(DbContextOptions<AdminDbContext> options)
            : base(options)
        {
        }

        public DbSet<AuditLogs> AuditLogs { get; set; }
        public DbSet<Batch> Batches { get; set; }
        public DbSet<Announcement> Announcements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // AuditLog mappings
            modelBuilder.Entity<AuditLogs>(entity =>
            {
                entity.Property(e => e.ServiceName).HasConversion<string>();
                entity.Property(e => e.Action).HasConversion<string>();
                entity.Property(e => e.Role).HasConversion<string>();
            });

            // Batch mappings
            modelBuilder.Entity<Batch>(entity =>
            {
                entity.HasIndex(b => b.BatchName).IsUnique();
            });

            // Announcement mappings
            modelBuilder.Entity<Announcement>(entity =>
            {
                entity.Property(a => a.CreatedByRole).HasConversion<string>();
                entity.Property(a => a.TargetRole).HasConversion<string>();
            });

        }
    }
}

