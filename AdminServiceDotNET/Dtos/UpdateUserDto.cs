using System.ComponentModel.DataAnnotations;

namespace AdminServiceDotNET.Dtos
{
    public class UpdateUserDto
    {
        public long? id { get; set; }
        
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name must not exceed 100 characters")]
        public string name { get; set; }
        
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string email { get; set; }
        
        [Required(ErrorMessage = "Role is required")]
        public string role { get; set; }
        
        [Required(ErrorMessage = "Status is required")]
        public string status { get; set; }
        
        public long? batchId { get; set; }
    }
}