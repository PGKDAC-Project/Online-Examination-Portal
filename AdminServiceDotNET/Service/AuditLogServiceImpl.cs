using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using AdminServiceDotNET.Models;
using AdminServiceDotNET.Dtos;

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
        
        public async Task CreateLogAsync(AuditLogCreateDto dto)
        {
            var log = new AuditLogs
            {
                ServiceName = Enum.Parse<ServiceName>(dto.ServiceName),
                UserEmail = dto.UserEmail,
                Role = Enum.Parse<UserRole>(dto.Role),
                Action = Enum.Parse<AuditAction>(dto.Action),
                Details = dto.Details,
                CreatedAt = DateTime.UtcNow
            };
            dbContext.Add(log);
            await dbContext.SaveChangesAsync();
        }
    }
}