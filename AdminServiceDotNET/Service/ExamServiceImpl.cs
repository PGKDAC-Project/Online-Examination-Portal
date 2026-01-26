using AdminServiceDotNET.Dtos;
using System.Net.Http.Headers;

namespace AdminServiceDotNET.Service
{
    public class ExamServiceImpl : IExamService
    {
        private readonly HttpClient client;

        public ExamServiceImpl(HttpClient client)
        {
            this.client = client;
        }

        private void AddAuth(string token)
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        public async Task<IEnumerable<ExamDto>> GetAllExamsAsync(string jwtToken)
        {
            AddAuth(jwtToken);
            return await client.GetFromJsonAsync<IEnumerable<ExamDto>>("http://127.0.0.1:8080/oep/admin/exams") ?? new List<ExamDto>();
        }

        public async Task DeleteExamAsync(long id, string jwtToken)
        {
            AddAuth(jwtToken);
            var response = await client.DeleteAsync($"http://127.0.0.1:8080/oep/admin/exams/{id}");
            response.EnsureSuccessStatusCode();
        }
    }
}
