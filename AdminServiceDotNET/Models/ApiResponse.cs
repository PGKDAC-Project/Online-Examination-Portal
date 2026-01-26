namespace AdminServiceDotNET.Models
{
    public class ApiResponse
    {
        public string Status { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Details { get; set; }
        public DateTime TimeStamp { get; set; } = DateTime.UtcNow;
    }
}
