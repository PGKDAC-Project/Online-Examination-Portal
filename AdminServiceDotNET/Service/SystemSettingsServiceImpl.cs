using AdminServiceDotNET.Data;
using AdminServiceDotNET.Dtos;
using AdminServiceDotNET.Models;

namespace AdminServiceDotNET.Service
{
    public class SystemSettingsServiceImpl : ISystemSettingsService
    {
        private readonly ISystemSettingsRepository repository;

        public SystemSettingsServiceImpl(ISystemSettingsRepository repository)
        {
            this.repository = repository;
        }

        public async Task<SystemSettingsDto> GetSettingsAsync()
        {
            var s = await repository.GetAsync();
            return new SystemSettingsDto
            {
                MaintenanceMode = s.MaintenanceMode,
                TabSwitchDetection = s.TabSwitchDetection,
                FullscreenEnforcement = s.FullscreenEnforcement,
                ExamAutoSubmit = s.ExamAutoSubmit
            };
        }

        public async Task UpdateSettingsAsync(SystemSettingsDto dto)
        {
            var s = await repository.GetAsync();
            s.MaintenanceMode = dto.MaintenanceMode;
            s.TabSwitchDetection = dto.TabSwitchDetection;
            s.FullscreenEnforcement = dto.FullscreenEnforcement;
            s.ExamAutoSubmit = dto.ExamAutoSubmit;
            await repository.UpdateAsync(s);
        }
    }
}
