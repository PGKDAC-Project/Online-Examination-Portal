using AdminServiceDotNET.Dtos;

namespace AdminServiceDotNET.Service
{
    public interface IExamService
    {
        Task<IEnumerable<ExamDto>> GetAllExamsAsync(string jwtToken);
        Task DeleteExamAsync(long id, string jwtToken);
    }
}
