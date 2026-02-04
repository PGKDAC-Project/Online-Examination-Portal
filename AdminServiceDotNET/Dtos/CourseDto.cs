using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AdminServiceDotNET.Dtos
{
    public class CourseDto
    {
        public long Id { get; set; }
        
        [Required(ErrorMessage = "Course code is required")]
        [StringLength(20, ErrorMessage = "Course code must not exceed 20 characters")]
        public string CourseCode { get; set; }
        
        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, ErrorMessage = "Title must not exceed 200 characters")]
        public string Title { get; set; }
        
        [StringLength(1000, ErrorMessage = "Description must not exceed 1000 characters")]
        public string Description { get; set; }
        
        public HashSet<long> InstructorIds { get; set; } = new HashSet<long>();
        
        public string Status { get; set; }
        public List<SyllabusDto> Syllabus { get; set; } = new List<SyllabusDto>();
    }
}
