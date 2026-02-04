# Error Report: Announcement Service JWT Claims Issue

## Problem
The AnnouncementService was failing to create announcements with validation errors "Creator role is required, Creator email is required" even though JWT authentication was working.

## Root Cause
The JWT token claims were not being extracted correctly due to incorrect claim type mapping:

### JWT Token Claims Structure
```
Available claims:
  http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier: nitishkumardbg17@gmail.com
  iat: 1770193069
  exp: 1770265069
  user_id: 1
  user_role: ROLE_ADMIN
  http://schemas.microsoft.com/ws/2008/06/identity/claims/role: ROLE_ADMIN
```

### Issue
- **Email Claim**: Located in `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier` (ClaimTypes.NameIdentifier)
- **Role Claim**: Located in `user_role` 
- **Original Code**: Was looking for email in `sub`, `email`, `unique_name` claims (which didn't exist)

## Solution
Updated the claim extraction logic in `AnnouncementServiceImpl.cs`:

```csharp
// Fixed email extraction to use ClaimTypes.NameIdentifier first
var userEmail = user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
               user.FindFirst("sub")?.Value ?? 
               user.FindFirst("email")?.Value ?? 
               user.FindFirst("unique_name")?.Value ?? 
               user.Identity?.Name;

var userRoleStr = user.FindFirst("user_role")?.Value ?? 
                 user.FindFirst("role")?.Value ?? 
                 user.FindFirst(ClaimTypes.Role)?.Value;
```

## Key Learning
- JWT claim types can vary between implementations
- Always debug and inspect actual claim structure before assuming standard claim names
- Use `ClaimTypes.NameIdentifier` for user email in .NET applications
- The `user_role` claim was working correctly from the start

## Status
✅ **RESOLVED** - Announcements can now be created successfully with proper JWT claim extraction.