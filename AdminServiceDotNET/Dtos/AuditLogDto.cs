using System;

namespace AdminServiceDotNET.Dtos
{
    public class AuditLogDto
    {
        public long Id { get; set; }
        public DateTime Time { get; set; }
        public string User { get; set; }
        public string Role { get; set; }
        public string Action { get; set; }
        public string ServiceName { get; set; }
        public string Status { get; set; }
        public string Details { get; set; }
    }
}
