using AdminServiceDotNET.Dtos;

namespace AdminServiceDotNET.Service
{
    public interface ICourseService
    {
        Task<IEnumerable<CourseDto>> GetAllCoursesAsync(string jwtToken);
        Task CreateCourseAsync(CourseDto dto, string jwtToken);
        Task UpdateCourseAsync(long id, CourseDto dto, string jwtToken);
        Task UpdateCourseStatusAsync(long id, string status, string jwtToken);
        Task DeleteCourseAsync(long id, string jwtToken);
    }
}
