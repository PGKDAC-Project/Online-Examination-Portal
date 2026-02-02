using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AdminServiceDotNET.Dtos
{
    public class BatchDto
    {
        public long Id { get; set; }
        
        [Required(ErrorMessage = "Batch name is required")]
        [StringLength(100, ErrorMessage = "Batch name must not exceed 100 characters")]
        public string BatchName { get; set; }
        
        [StringLength(500, ErrorMessage = "Description must not exceed 500 characters")]
        public string Description { get; set; }
        
        [Required(ErrorMessage = "Start date is required")]
        [JsonPropertyName("startDate")]
        public DateTime StartDate { get; set; }
        
        [Required(ErrorMessage = "End date is required")]
        [JsonPropertyName("endDate")]
        public DateTime EndDate { get; set; }
        
        [Required(ErrorMessage = "Status is required")]
        public string Status { get; set; }
    }
}
