namespace AdminServiceDotNET.Dtos
{
    public class CourseDto
    {
        public long Id { get; set; }
        public string CourseCode { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public long InstructorId { get; set; } // Simplified for gateway
        public string Status { get; set; }
    }
}
