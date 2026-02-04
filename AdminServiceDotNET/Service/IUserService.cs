using AdminServiceDotNET.Dtos;

namespace AdminServiceDotNET.Service
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync(string jwtToken);
        Task<UserDto?> GetUserByIdAsync(long id, string jwtToken);
        Task CreateUser(UserDto dto, string jwtToken);
        Task UpdateUserAsync(long id, UpdateUserDto dto, string jwtToken);
        Task DeleteUserAsync(long id, string jwtToken);
    }
}
