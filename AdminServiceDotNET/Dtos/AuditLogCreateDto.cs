namespace AdminServiceDotNET.Dtos
{
    public class AuditLogCreateDto
    {
        public string ServiceName { get; set; }
        public string UserEmail { get; set; }
        public string Role { get; set; }
        public string Action { get; set; }
        public string Details { get; set; }
    }
}
