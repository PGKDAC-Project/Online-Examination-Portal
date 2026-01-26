namespace AdminServiceDotNET.Dtos
{
    public class ExamDto
    {
        public long Id { get; set; }
        public string ExamTitle { get; set; }
        public long CourseId { get; set; }
        public DateTime StartTime { get; set; }
        public int DurationMinutes { get; set; }
        public int TotalMarks { get; set; }
        public string Status { get; set; }
        public string? ExamPassword { get; set; }
    }
}
