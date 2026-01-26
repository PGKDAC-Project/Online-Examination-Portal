using System.Text.Json.Serialization;

namespace AdminServiceDotNET.Dtos
{
    public class AnnouncementDto
    {
        public long Id { get; set; }
        public string Title { get; set; }
        
        // Accept 'description' from frontend, map to 'Message' for backend
        [JsonPropertyName("description")]
        public string Description { get; set; }
        
        public string Message { get; set; }
        public string CreatedByEmail { get; set; }
        public string CreatedByRole { get; set; }
        public string TargetRole { get; set; }
        public string TargetBatch { get; set; }
        public bool IsActive { get; set; }
        
        [JsonPropertyName("expiryDate")]
        public string ExpiryDate { get; set; }
        
        public DateTime? ExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Date { get; set; }
    }
}
