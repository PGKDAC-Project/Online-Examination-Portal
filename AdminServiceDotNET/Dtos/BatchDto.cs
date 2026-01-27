using System.Text.Json.Serialization;

namespace AdminServiceDotNET.Dtos
{
    public class BatchDto
    {
        public long Id { get; set; }
        public string BatchName { get; set; }
        public string Description { get; set; }
        
        [JsonPropertyName("startDate")]
        public DateTime StartDate { get; set; }
        
        [JsonPropertyName("endDate")]
        public DateTime EndDate { get; set; }
        
        public string Status { get; set; }
    }
}
