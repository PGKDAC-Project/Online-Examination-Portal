namespace AdminServiceDotNET.Dtos
{
    public class AnnouncementDto
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string CreatedByEmail { get; set; }
        public string CreatedByRole { get; set; }
        public string TargetRole { get; set; }
        public bool IsActive { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
