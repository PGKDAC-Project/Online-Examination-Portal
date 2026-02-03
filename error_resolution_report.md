# Error Resolution Report

This report outlines the technical hurdles encountered during the debugging process and the strategies used to overcome them.

## 1. Admin Login Failure (401 Unauthorized)
- **Error**: "Bad credentials" on login despite correct plain-text password.
- **Cause**: Database password hash was corrupted or generated using an incompatible algorithm.
- **Resolution**: 
    1. Created a temporary `DebugController` in the Spring backend.
    2. Used the application's own `BCryptPasswordEncoder` to generate a fresh hash for `admin@123`.
    3. Updated the `users` table via SQL with the verified hash.

## 2. Batch Creation Error (.NET Exception)
- **Error**: `System.Text.Json.JsonException: The JSON value could not be converted to System.Int64`.
- **Cause**: Frontend sent an empty or null `id`, but the .NET DTO expected a mandatory `long`.
- **Resolution**: Modified `BatchDto.cs` to use `long?` (nullable), making the ID optional for new creations.

## 3. User Creation 400 Bad Request (.NET & Spring)
- **Error 1**: `The joinDate field is required`.
- **Cause**: .NET model validation failed because the frontend didn't send `joinDate`.
- **Resolution**: Updated `UserDto.cs` to make `joinDate` nullable.
- **Error 2**: `Invalid UserRole` or `Enum Const Not Found`.
- **Cause**: Frontend sent "Student", but Spring expected `ROLE_STUDENT`.
- **Resolution**: implemented role prefixing (`ROLE_`) and case-insensitive enum parsing in `UserServiceImpl.java`.

## 4. Build & File Lock Issues (.NET)
- **Error**: `The file is locked by: AdminServiceDotNET.exe`.
- **Cause**: Attempting to rebuild the service while it was still running in the background.
- **Resolution**: Used `taskkill /F /IM AdminServiceDotNET.exe` to clear stalled processes before recompiling.

## 5. Spring Security Pathing
- **Error**: 404 or 403 on new debug endpoints.
- **Cause**: Strict permit-all rules in `SecurityConfiguration.java`.
- **Resolution**: Temporarily permitted `/public/**` paths to allow debug bridge access, then reverted for security.
