using AdminServiceDotNET.Exceptions;
using AdminServiceDotNET.Models;
using System.Net;
using System.Text.Json;

namespace AdminServiceDotNET.Middleware
{
    public class GlobalExceptionMiddleware
    {
        public readonly RequestDelegate _next;
        public readonly ILogger<GlobalExceptionMiddleware> _logger;
       public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                await HandleException(context, ex);
            }
        }
        private static async Task HandleException(HttpContext context, Exception ex)
        {
            HttpStatusCode status = HttpStatusCode.InternalServerError;
            string message = ex.Message;
            switch (ex)
            {
                case NotFoundException:
                    status = HttpStatusCode.NotFound;
                    message = ex.Message;
                    break;
                case BadRequestException:
                    status = HttpStatusCode.BadRequest;
                    message = ex.Message;
                    break;
                case UnauthorizedAccessException:
                    status = HttpStatusCode.Unauthorized;
                    message = ex.Message;
                    break;
            }
            var error = new ApiResponse
            {
                Status = (int)status,
                Message = message
            };
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)status;
            await context.Response.WriteAsync(JsonSerializer.Serialize(error)); 
        }
    }
}
