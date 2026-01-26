namespace AdminServiceDotNET.Dtos
{
    public class AuditLog
    {
        public long Id { get; set; }
        public ServiceName ServiceName { get; set; }
        public string UserEmail { get; set; }
        public UserRole Role { get; set; }
        public AuditAction Action { get; set; }
        public string Details { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
