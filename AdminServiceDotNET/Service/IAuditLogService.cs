using AdminServiceDotNET.Models;

namespace AdminServiceDotNET.Service
{
    public interface IAuditLogService
    {
        Task<IEnumerable<AuditLogs>> GetAllLogsAsync();
        Task LogAsync(ServiceName serviceName, string userEmail, UserRole role, AuditAction action, string details);
    }
}
