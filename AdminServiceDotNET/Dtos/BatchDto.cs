namespace AdminServiceDotNET.Dtos
{
    public class BatchDto
    {
        public long Id { get; set; }
        public string BatchName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
