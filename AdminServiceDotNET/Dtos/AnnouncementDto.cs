using System.Text.Json.Serialization;

namespace AdminServiceDotNET.Dtos
{
    public class AnnouncementDto
    {
        public long Id { get; set; }
        [JsonPropertyName("title")]
        public string Title { get; set; }
        
        [JsonPropertyName("description")]
        public string Description { get; set; }
        
        [JsonPropertyName("createdByEmail")]
        public string CreatedByEmail { get; set; }
        
        [JsonPropertyName("createdByRole")]
        public string CreatedByRole { get; set; }
        
        [JsonPropertyName("targetRole")]
        public string TargetRole { get; set; }
        
        [JsonPropertyName("targetBatch")]
        public string TargetBatch { get; set; }
        
        [JsonPropertyName("isActive")]
        public bool IsActive { get; set; }
        
        [JsonPropertyName("expiryDate")]
        public DateTime? ExpiresAt { get; set; }
        
        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; }
    }
}
