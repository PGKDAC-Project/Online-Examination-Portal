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
            var springBackendUrl = "http://127.0.0.1:8080/oep";
            return await client.GetFromJsonAsync<IEnumerable<UserDto>>($"{springBackendUrl}/admin/users") ?? new List<UserDto>();
        }

        public async Task<UserDto?> GetUserByIdAsync(long id, string jwtToken)
        {
            AddAuth(jwtToken);
            var springBackendUrl = "http://127.0.0.1:8080/oep";
            return await client.GetFromJsonAsync<UserDto>($"{springBackendUrl}/admin/users/{id}");
        }

        public async Task CreateUser(UserDto dto, string jwtToken)
        {
            AddAuth(jwtToken);
            var springBackendUrl = "http://127.0.0.1:8080/oep";
            var response = await client.PostAsJsonAsync(
                $"{springBackendUrl}/admin/users",
                 dto
            );
            if (!response.IsSuccessStatusCode)
                throw new Exception("Failed to create user in user service.");

        }

        public async Task UpdateUserAsync(long id, UpdateUserDto dto, string jwtToken)
        {
            AddAuth(jwtToken);
            var springBackendUrl = "http://127.0.0.1:8080/oep";
            var response = await client.PutAsJsonAsync($"{springBackendUrl}/admin/users/{id}", dto);
            response.EnsureSuccessStatusCode();
        }

        public async Task DeleteUserAsync(long id, string jwtToken)
        {
            AddAuth(jwtToken);
            var springBackendUrl = "http://127.0.0.1:8080/oep";
            var response = await client.DeleteAsync($"{springBackendUrl}/admin/users/{id}");
            response.EnsureSuccessStatusCode();
        }
    }
}