using AdminServiceDotNET.Dtos;
using System.Net.Http.Headers;

namespace AdminServiceDotNET.Service
{
    public class CourseServiceImpl : ICourseService
    {
        private readonly HttpClient client;

        public CourseServiceImpl(HttpClient client)
        {
            this.client = client;
        }

        private void AddAuth(string token)
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        public async Task<IEnumerable<CourseDto>> GetAllCoursesAsync(string jwtToken)
        {
            AddAuth(jwtToken);
            return await client.GetFromJsonAsync<IEnumerable<CourseDto>>("http://localhost:8080/oep/courses") ?? new List<CourseDto>();
        }

        public async Task CreateCourseAsync(CourseDto dto, string jwtToken)
        {
            AddAuth(jwtToken);
            var response = await client.PostAsJsonAsync("http://localhost:8080/oep/courses", dto);
            response.EnsureSuccessStatusCode();
        }

        public async Task UpdateCourseAsync(long id, CourseDto dto, string jwtToken)
        {
            AddAuth(jwtToken);
            var response = await client.PutAsJsonAsync($"http://localhost:8080/oep/courses/{id}", dto);
            response.EnsureSuccessStatusCode();
        }

        public async Task UpdateCourseStatusAsync(long id, string status, string jwtToken)
        {
            AddAuth(jwtToken);
            var response = await client.PatchAsJsonAsync($"http://localhost:8080/oep/courses/{id}/status", new { status });
            response.EnsureSuccessStatusCode();
        }

        public async Task DeleteCourseAsync(long id, string jwtToken)
        {
            AddAuth(jwtToken);
            var response = await client.DeleteAsync($"http://localhost:8080/oep/courses/{id}");
            response.EnsureSuccessStatusCode();
        }
    }
}
