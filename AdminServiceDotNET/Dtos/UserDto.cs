using System.ComponentModel.DataAnnotations;

namespace AdminServiceDotNET.Dtos
{
    public class UserDto
    {
        public long? id { get; set; }
        
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name must not exceed 100 characters")]
        public string name { get; set; }
        
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string email { get; set; }
        
        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 5, ErrorMessage = "Password must be between 5 and 100 characters")]
        public string password { get; set; }
        
        [Required(ErrorMessage = "Role is required")]
        public string role { get; set; }
        
        [Required(ErrorMessage = "Status is required")]
        public string status { get; set; }
        
        public long? batchId { get; set; }
        public DateTime? lastLogin { get; set; }
        public string? joinDate { get; set; }
    }
}
