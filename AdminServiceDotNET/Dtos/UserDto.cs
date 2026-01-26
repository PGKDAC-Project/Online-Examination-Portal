namespace AdminServiceDotNET.Dtos
{
    public class UserDto
    {
        public long id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public string role { get; set; }
        public string status { get; set; }
        public long? batchId { get; set; }
        public DateTime? lastLogin { get; set; }
        public string joinDate { get; set; }
    }
}
