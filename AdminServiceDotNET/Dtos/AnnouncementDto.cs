using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AdminServiceDotNET.Dtos
{
    public class AnnouncementDto
    {
        public long Id { get; set; }
        
        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, ErrorMessage = "Title must not exceed 200 characters")]
        [JsonPropertyName("title")]
        public string Title { get; set; }
        
        [Required(ErrorMessage = "Description is required")]
        [StringLength(2000, ErrorMessage = "Description must not exceed 2000 characters")]
        [JsonPropertyName("description")]
        public string Description { get; set; }
        
        [Required(ErrorMessage = "Creator email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [JsonPropertyName("createdByEmail")]
        public string CreatedByEmail { get; set; }
        
        [Required(ErrorMessage = "Creator role is required")]
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
