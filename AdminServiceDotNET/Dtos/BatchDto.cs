using System.Text.Json.Serialization;

namespace AdminServiceDotNET.Dtos
{
    public class BatchDto
    {
        public long Id { get; set; }
        public string BatchName { get; set; }
        
        // Accept string dates from frontend (YYYY-MM format)
        [JsonPropertyName("startDate")]
        public string StartDateString { get; set; }
        
        [JsonPropertyName("endDate")]
        public string EndDateString { get; set; }
        
        // DateTime properties for backend processing
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; }
    }
}
