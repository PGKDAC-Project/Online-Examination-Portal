using AdminServiceDotNET.Models;

namespace AdminServiceDotNET.Data
{
    public interface ISystemSettingsRepository
    {
        Task<SystemSettings> GetAsync();
        Task UpdateAsync(SystemSettings settings);
    }
}
