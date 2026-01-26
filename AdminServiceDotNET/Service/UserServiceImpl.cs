using AdminServiceDotNET.Dtos;
using AdminServiceDotNET.Service;
using System.Net.Http.Headers;

namespace AdminServiceDotNET.Service
{
    public class UserServiceImpl : IUserService
    {
        private readonly HttpClient client;
        public UserServiceImpl(HttpClient client)
        {
            this.client = client;
        }

        private void AddAuth(string token)
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync(string jwtToken)
        {
            AddAuth(jwtToken);
            return await client.GetFromJsonAsync<IEnumerable<UserDto>>("http://localhost:8080/oep/admin/users") ?? new List<UserDto>();
        }

        public async Task<UserDto?> GetUserByIdAsync(long id, string jwtToken)
        {
            AddAuth(jwtToken);
            return await client.GetFromJsonAsync<UserDto>($"http://localhost:8080/oep/admin/users/{id}");
        }

        public async Task CreateUser(UserDto dto, string jwtToken)
        {
            AddAuth(jwtToken);
            var response = await client.PostAsJsonAsync(
                "http://localhost:8080/oep/admin/users",
                 dto
            );
            if (!response.IsSuccessStatusCode)
                throw new Exception("Failed to create user in user service.");

        }

        public async Task UpdateUserAsync(long id, UserDto dto, string jwtToken)
        {
            AddAuth(jwtToken);
            var response = await client.PutAsJsonAsync($"http://localhost:8080/oep/admin/users/{id}", dto);
            response.EnsureSuccessStatusCode();
        }

        public async Task DeleteUserAsync(long id, string jwtToken)
        {
            AddAuth(jwtToken);
            var response = await client.DeleteAsync($"http://localhost:8080/oep/admin/users/{id}");
            response.EnsureSuccessStatusCode();
        }
    }
}