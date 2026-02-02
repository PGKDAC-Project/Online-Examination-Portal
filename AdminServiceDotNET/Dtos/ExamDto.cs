using System.ComponentModel.DataAnnotations;

namespace AdminServiceDotNET.Dtos
{
    public class ExamDto
    {
        public long Id { get; set; }
        
        [Required(ErrorMessage = "Exam title is required")]
        [StringLength(200, ErrorMessage = "Exam title must not exceed 200 characters")]
        public string ExamTitle { get; set; }
        
        [Required(ErrorMessage = "Course ID is required")]
        [Range(1, long.MaxValue, ErrorMessage = "Course ID must be greater than 0")]
        public long CourseId { get; set; }
        
        [Required(ErrorMessage = "Start time is required")]
        public DateTime StartTime { get; set; }
        
        [Required(ErrorMessage = "Duration is required")]
        [Range(1, 600, ErrorMessage = "Duration must be between 1 and 600 minutes")]
        public int DurationMinutes { get; set; }
        
        [Required(ErrorMessage = "Total marks is required")]
        [Range(1, 1000, ErrorMessage = "Total marks must be between 1 and 1000")]
        public int TotalMarks { get; set; }
        
        [Required(ErrorMessage = "Status is required")]
        public string Status { get; set; }
        
        [StringLength(50, ErrorMessage = "Exam password must not exceed 50 characters")]
        public string? ExamPassword { get; set; }
    }
}
