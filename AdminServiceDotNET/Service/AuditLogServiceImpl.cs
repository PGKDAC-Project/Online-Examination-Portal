using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using AdminServiceDotNET.Models;

namespace AdminServiceDotNET.Service
{
    public class AuditLogServiceImpl : IAuditLogService
    {
        private readonly AdminDbContext dbContext;

        public AuditLogServiceImpl(AdminDbContext context)
        {
            dbContext = context;
        }


        public async Task<IEnumerable<AuditLogs>> GetAllLogsAsync()
        {
            var logs = from l in dbContext.AuditLogs
                        orderby l.CreatedAt descending
                        select l;

            return await logs.ToListAsync();
        }

        public async Task LogAsync(ServiceName serviceName, string userEmail, UserRole role, AuditAction action, string details)
        {
            var log = new AuditLogs
                        {
                            ServiceName = serviceName,
                            UserEmail = userEmail,
                            Role = role,
                            Action = action,
                            Details = details,
                            CreatedAt = DateTime.UtcNow
                        };
            dbContext.Add(log);
            await dbContext.SaveChangesAsync();
        }
    }
}