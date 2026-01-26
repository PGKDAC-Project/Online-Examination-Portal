namespace AdminServiceDotNET.Models
{
    public class ApiResponse
    {
        public int Status { get; set; } 
        public string Message { get; set; } = string.Empty;
        public string? Details { get; set; }
        public DateTime TimeStamp { get; set; } = DateTime.UtcNow;
    }
}
