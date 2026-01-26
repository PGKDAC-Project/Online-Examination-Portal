using AdminServiceDotNET.Models;
using Microsoft.EntityFrameworkCore;

namespace AdminServiceDotNET.Data
{
    public class SystemSettingsRepositoryImpl : ISystemSettingsRepository
    {
        private readonly AdminDbContext _context;

        public SystemSettingsRepositoryImpl(AdminDbContext context)
        {
            _context = context;
        }

        public async Task<SystemSettings> GetAsync()
        {
            var settings = await _context.SystemSettings.FirstOrDefaultAsync();
            if (settings == null)
            {
                // this will initialize default settings if not exists
                settings = new SystemSettings();
                _context.SystemSettings.Add(settings);
                await _context.SaveChangesAsync();
            }
            return settings;
        }

        public async Task UpdateAsync(SystemSettings settings)
        {
            settings.LastUpdated = DateTime.UtcNow;
            _context.SystemSettings.Update(settings);
            await _context.SaveChangesAsync();
        }
    }
}
