using AdminServiceDotNET.Dtos;

namespace AdminServiceDotNET.Service
{
    public interface ISystemSettingsService
    {
        Task<SystemSettingsDto> GetSettingsAsync();
        Task UpdateSettingsAsync(SystemSettingsDto dto);
    }
}
