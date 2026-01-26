# Online Examination Portal - Error Resolution Report

This document logs the errors encountered during development and their respective solutions in a Q&A format.

---

## 1. .NET Build File Lock Error

**Question:** Why did the .NET build fail with error `MSB3021` and `MSB3027` stating that the file `AdminServiceDotNET.exe` is locked by another process?

![Build Error Screenshot](C:/Users/arkks/.gemini/antigravity/brain/4e16c666-7726-4cca-8e48-c822a6e49555/uploaded_media_1769447038347.png)

**Answer:**
This occurs because an instance of the `AdminServiceDotNET` application is already running (either via debugger, terminal, or IIS Express). Windows prevents the compiler from overwriting the executable file while it is currently being executed.

**Resolution:**
1.  Identify the process ID (PID) mentioned in the error or use `Get-Process AdminServiceDotNET`.
2.  Terminate the process using `Stop-Process -Name AdminServiceDotNET -Force`.
3.  **Pro Tip:** If the port seems free but the build still fails with "Access Denied" or "File Locked", a zombie process is holding the `.exe`. Run `Stop-Process -Name AdminServiceDotNET -Force` immediately.
4.  Clean the solution and rebuild.

---

## 2. Admin Service Connection Refused (500 Internal Server Error)

**Question:** Why does the User Management page show "No users found" with a console error: "No connection could be made because the target machine actively refused it. (localhost:8080)"?

![Service Connection Error Screenshot](C:/Users/arkks/.gemini/antigravity/brain/4e16c666-7726-4cca-8e48-c822a6e49555/uploaded_media_1769449331134.png)

**Answer:**
This error indicates a multi-layer communication failure:
1.  **Backend Not Running:** The Spring Boot core backend (port 8080) was not active, so the .NET Admin Service could not fetch data.
2.  **DNS/Port Resolution:** On Windows, `localhost` can sometimes resolve to the IPv6 address `::1`, but the Spring Boot application might only be listening on the IPv4 address `127.0.0.1`.

**Resolution:**
1.  **Restart Backend:** Ensure the Spring Boot application is running (`./mvnw spring-boot:run`).
2.  **Update Config:** Change internal service URLs from `http://localhost:8080` to `http://127.0.0.1:8080` to force IPv4 communication.
3.  **Check CORS:** Ensure the Spring Backend allowed origins include the frontend URL (`http://localhost:5173`).

---

## 3. Recharts "Width/Height greater than 0" Error in Analytics

**Question:** Why does the Analytics page show warnings in the console: "The width(-1) and height(-1) of chart should be greater than 0"?

![Analytics Error Screenshot 1](C:/Users/arkks/.gemini/antigravity/brain/4e16c666-7726-4cca-8e48-c822a6e49555/uploaded_media_0_1769450587029.png)
![Analytics Error Screenshot 2](C:/Users/arkks/.gemini/antigravity/brain/4e16c666-7726-4cca-8e48-c822a6e49555/uploaded_media_1_1769450587029.png)

**Answer:**
This is a common issue with the `ResponsiveContainer` component in the Recharts library. It occurs when the chart attempts to calculate the dimensions of its parent container before the browser has finished the initial layout pass or while the container is transitioning (e.g., during navigation or sidebar toggling). This results in invalid (-1 or 0) dimensions.

**Resolution:**
1.  **Add Debounce:** Set the `debounce={100}` prop on the `ResponsiveContainer` to delay the dimension calculation slightly until the layout is stable.
2.  **Ensure Parent Dimensions:** Explicitly set `height` and `minHeight` on the wrapper `div` of the chart to ensure there is always a valid height for the chart to inherit.
3.  **Use 100% Width/Height:** Ensure the `ResponsiveContainer` is set to `width="100%"` and `height="100%"` while the parent handles the fixed pixel constraints.

---

## 4. React "Unique Key Prop" Warning in User Management

**Question:** Why did the console show "Each child in a list should have a unique 'key' prop" in the User Management table?

![Unique Key Error Screenshot](C:/Users/arkks/.gemini/antigravity/brain/4e16c666-7726-4cca-8e48-c822a6e49555/uploaded_media_1769450838385.png)

**Answer:**
This warning occurred because the table rows (`tr`) in the `tbody` were being rendered using `user.id` as the key, but the `UserDto` in the `.NET Admin Service` was missing the `id` field. This resulted in `undefined` keys for all rows, causing React to lose track of individual elements during reconciliation.

**Resolution:**
1.  **Modified .NET DTO:** Updated `AdminServiceDotNET/Dtos/UserDto.cs` to include the `public long id { get; set; }` property.
2.  **Frontend Fallback:** Updated `UserManagement.jsx` to use a fallback key: `key={u.id || u.email}`.
3.  **Static Row Key:** Added a static key `key="no-users"` for the "No users found" row to prevent similar warnings when the list is empty.

---

## 5. Course Creation 400 Bad Request (DTO Mismatch)

**Question:** Why did "Create New Course" fail with a `400 Bad Request` and "Admin Service API Error"?

![Course Creation Error Screenshot](C:/Users/arkks/.gemini/antigravity/brain/4e16c666-7726-4cca-8e48-c822a6e49555/uploaded_media_1769451173090.png)

**Answer:**
This error occurred due to a structural mismatch in the data transfer objects (DTOs) across the three layers (Frontend, .NET Admin Service, and Spring Core Backend):
1.  **Field Name Mismatch:** The frontend was sending `instructorDetails` (a full object), but the .NET and Spring DTOs expected `instructorId` (a long).
2.  **Missing Field:** The frontend was sending a `syllabus` array, but this field was missing from both the .NET `CourseDto` and the Spring `CourseRequestDto`.
3.  **Validation Failure:** Because the .NET service received an unexpected object structure, it failed to bind the request to the `CourseDto`, resulting in a `400 Bad Request`.

**Resolution:**
1.  **Backend Update (Spring):** Updated `CourseRequestDto.java` to include the `syllabus` list and updated the service layer to handle the module data.
2.  **Gateway Update (.NET):** Created `SyllabusDto.cs` and updated `CourseDto.cs` to include the syllabus array and match the frontend's property naming.
3.  **Frontend Update:** Modified `CourseGovernance.jsx` to send the `instructorId` as a numeric value instead of the full `instructorDetails` object.
4.  **Sync:** Restarted all services to ensure the new DTO contracts were active.

---

## 6. Admin Locked Out by Maintenance Mode

**Question:** Why was the Administrator denied access to the portal when Maintenance Mode was enabled, and how will they disable it if they are blocked?

![Maintenance Mode Error Screenshot](C:/Users/arkks/.gemini/antigravity/brain/4e16c666-7726-4cca-8e48-c822a6e49555/uploaded_media_1769451532078.png)

**Answer:**
The `MaintenanceGuard` component was globally checking the system settings and redirecting all users (including Admins) to a maintenance overlay if `maintenanceMode` was active. This created a "lockout" scenario where the person responsible for managing the system could no longer reach the settings to turn maintenance mode off.

**Resolution:**
1.  **Role-Based Bypass:** Updated `MaintenanceGuard.jsx` to fetch the current user's role using `getCurrentUser()`.
2.  **Exemption Logic:** Added a check to see if the user has the `admin` role. If they do, the `maintenance` state is immediately set to `false`, allowing them to bypass the guard and access the control panel even during scheduled downtime.
3.  **Authentication Guard:** Ensured that this bypass only happens for authenticated Admins, while unauthenticated users or users with lower privileges (Students/Instructors) remain blocked.

---

## 8. Missing "Last Login" and Sidebar Responsiveness Issues

**Question:** Why does the User Management table show "Never" for the Last Login entry, and why is the sidebar overlapping or hiding page content on smaller screens?

![Layout and Login Error Screenshot](C:/Users/arkks/.gemini/antigravity/brain/4e16c666-7726-4cca-8e48-c822a6e49555/uploaded_media_1769452071742.png)

**Answer:**
1.  **Last Login Data Flow:** The `lastLogin` field was missing from the .NET `UserDto`, so the frontend never received the value. Additionally, the Spring Core Backend was not actually updating the `last_login` timestamp in the database during the sign-in process.
2.  **Layout Logic:** The `AdminLayout.css` used rigid `min-width` constraints and lacked container-aware shrinking logic for the main content area (`flex: 1` without `min-width: 0`), causing content to be "pushed" or "hidden" under the sidebar on narrow viewports.

**Resolution:**
1.  **Backend Logic (Spring):** Added `updateLastLogin` to `AuthService` and updated `AuthController` to refresh the timestamp upon every successful sign-in.
2.  **DTO Update (.NET):** Added `public DateTime? lastLogin { get; set; }` to `UserDto.cs` to bridge the data to the frontend.
3.  **Responsive CSS Fix:**
    *   Replaced `min-width` with a flexible `flex-shrink: 0` on the sidebar.
    *   Added `min-width: 0` to `.admin-content` to allow the flex child to shrink below its content's intrinsic size.
    *   Implemented a media query for screens `< 992px` that makes the sidebar `position: fixed` with a shadow overlay, preventing it from squashing the main content.
    *   Added a smooth transition for the sidebar collapse/expand animation.

---

## 9. Unable to Post Announcements (400 Bad Request)

**Question:** Why does posting an announcement fail with a `400 Bad Request` error?

![Announcement Error Screenshot](C:/Users/arkks/.gemini/antigravity/brain/4e16c666-7726-4cca-8e48-c822a6e49555/uploaded_media_1769452645627.png)

**Answer:**
This error was caused by a **DTO field name mismatch** between the React frontend and the .NET Admin Service:
1.  **Frontend sends:** `description`, `expiryDate`, `targetBatch`
2.  **Backend expected:** `Message`, `ExpiresAt` (and had no field for `targetBatch`)
3.  **Role Format Mismatch:** Frontend sends `"Student"` but backend enum expects `"ROLE_STUDENT"`

The .NET model binding failed because it couldn't map the incoming JSON properties to the DTO properties, resulting in validation errors.

**Resolution:**
1.  **Updated `AnnouncementDto.cs`:**
    *   Added `Description` property with `[JsonPropertyName("description")]` attribute to accept the frontend field
    *   Added `ExpiryDate` property with `[JsonPropertyName("expiryDate")]` for string-based date input
    *   Added `TargetBatch` property (for future batch-specific announcements)
    *   Added `Date` property for formatted display on the frontend
2.  **Updated `AnnouncementServiceImpl.cs`:**
    *   Map `Description` → `Message` when creating announcements
    *   Parse `ExpiryDate` string to `DateTime?` for database storage
    *   Handle role enum parsing with automatic `ROLE_` prefix addition
    *   Set default values for `CreatedByEmail` and `CreatedByRole`
3.  **Improved GET mapping:** Return both `description` and formatted `date` for frontend display consistency

---

## 10. Unable to Create Batches and View User Details (400 Bad Request)

**Question:** Why does creating a new batch fail with "Admin Service API Error", and why does clicking "View" on a user result in "Failed to load user details"?

![Batch Creation Error](C:/Users/arkks/.gemini/antigravity/brain/4e16c666-7726-4cca-8e48-c822a6e49555/uploaded_media_0_1769452970384.png)
![User View Error](C:/Users/arkks/.gemini/antigravity/brain/4e16c666-7726-4cca-8e48-c822a6e49555/uploaded_media_1_1769452970384.png)

**Answer:**
Both issues stem from **DTO field mismatches** similar to the announcement problem:

### Batch Creation Issue:
1.  **Frontend sends:** `startDate: "2025-02"` and `endDate: "2025-08"` (YYYY-MM string format from `<input type="month">`)
2.  **Backend expected:** `StartDate` and `EndDate` as `DateTime` objects
3.  **.NET model binding** failed to parse the string dates, resulting in validation errors

### User View Issue:
1.  **Frontend expects:** `joinDate` field in the user details
2.  **Backend returns:** No `joinDate` field in `UserDto`
3.  **Component fails** to render properly due to missing expected data

**Resolution:**

### Batch Fix:
1.  **Updated `BatchDto.cs`:**
    *   Added `StartDateString` and `EndDateString` properties with `[JsonPropertyName]` attributes
    *   Kept `DateTime` properties for internal processing
    *   Added `Status` property for frontend display
2.  **Updated `BatchServiceImpl.cs`:**
    *   Parse YYYY-MM strings by appending "-01" to create valid dates
    *   Return formatted string dates in GET responses
    *   Calculate and return batch status ("Active" or "Completed")

### User View Fix:
1.  **Updated `UserDto.cs`:**
    *   Added `joinDate` property (currently returns null as Spring backend doesn't track user creation date)
    *   This prevents the frontend from crashing when trying to display the field
2.  **Note:** Full implementation would require adding a `createdAt` field to the Spring User entity and UserResponseDto

---

## 11. User Edit Navigation Failure and PDF Export Not Working

**Question:** Why does clicking "Edit" on a user navigate to `/admin/users/undefined/edit`, and why does PDF export fail with "doc.autoTable is not a function"?

![User Edit Error](C:/Users/arkks/.gemini/antigravity/brain/4e16c666-7726-4cca-8e48-c822a6e49555/uploaded_media_0_1769453230409.png)
![PDF Export Error - User Management](C:/Users/arkks/.gemini/antigravity/brain/4e16c666-7726-4cca-8e48-c822a6e49555/uploaded_media_1_1769453230409.png)
![PDF Export Error - Activity Logs](C:/Users/arkks/.gemini/antigravity/brain/4e16c666-7726-4cca-8e48-c822a6e49555/uploaded_media_1769453467088.png)

**Answer:**

### User Edit Navigation Issue:
1.  **Root Cause:** The user object's `id` property is `undefined` when passed to the `editUser` function
2.  **Why:** The .NET Admin Service is returning user data, but the `id` field might not be properly deserialized or the Spring backend isn't including it in the response
3.  **Result:** Navigation to `/admin/users/undefined/edit` causes a 400 Bad Request

### PDF Export Issue:
1.  **Root Cause:** The `jspdf-autotable` plugin is not installed in the project
2.  **Why:** The `exportUtils.js` imports and uses `jspdf-autotable`, but it's missing from `package.json`
3.  **Result:** Runtime error "doc.autoTable is not a function"
4.  **Scope:** Affects **ALL** PDF exports across the application:
    - User Management → Export PDF
    - Activity Logs → Export PDF
    - Any other page using the `exportToPDF` utility function

**Resolution:**

### User Edit Fix:
**Option 1 - Verify Data Flow (Recommended):**
1.  Check that Spring `UserResponseDto` includes `id` field ✅ (already present)
2.  Verify .NET `UserDto` has lowercase `id` property ✅ (already added)
3.  Ensure .NET JSON serialization is case-insensitive ✅ (already configured with `PropertyNameCaseInsensitive = true`)
4.  **Action Required:** Restart .NET service to apply the `id` field addition to `UserDto`

**Option 2 - Frontend Fallback:**
- Update `UserManagement.jsx` to use a fallback: `u.id || u.Id` to handle both casing scenarios

### PDF Export Fix:
**Install Required Dependencies:**
```bash
# Run in PowerShell with elevated permissions or use Git Bash
npm install jspdf jspdf-autotable
```

**If PowerShell execution policy blocks npm:**
1.  Open PowerShell as Administrator
2.  Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3.  Then install: `npm install jspdf jspdf-autotable`

**Alternative (Git Bash):**
```bash
cd frontend-Application
npm install jspdf jspdf-autotable
```

**Verification:**
- Check `package.json` includes both `jspdf` and `jspdf-autotable` in dependencies
- Restart the development server (`npm run dev`)

---

## 12. Sidebar Content Not Scrollable

**Question:** Why were the menu items ("Courses", "Analytics", "Settings") cut off / inaccessible on smaller screens or when the window height was reduced?

![Sidebar Scroll Error](C:/Users/arkks/.gemini/antigravity/brain/4e16c666-7726-4cca-8e48-c822a6e49555/uploaded_media_1769453770974.png)

**Answer:**
1.  **CSS Constraints:** The `.admin-sidebar` container had a fixed height of `100vh` and `overflow: hidden` (implicit or inherited behavior in some contexts), or simply lacked `overflow-y: auto`.
2.  **Flexbox Behavior:** While it used `flex-direction: column`, without an overflow property, the content simply extended past the visible container boundary and was clipped by the parent wrapper's `overflow: hidden`.

**Resolution:**
1.  **Updated `AdminLayout.css`:**
    *   Added `overflow-y: auto` to `.admin-sidebar` to enable vertical scrolling when content exceeds viewport height.
    *   Added custom scrollbar styling (thin width, dark colors) to match the premium dark theme of the sidebar so the scrollbar doesn't look jarring.

---

## 13. Mobile Sidebar UX Issues (Hamburger Button Hidden & Content Overlap)

**Question:** Why does the sidebar cover the main content and hide the hamburger toggle button on smaller screens, making it impossible to close?

![Mobile Sidebar Error](C:/Users/arkks/.gemini/antigravity/brain/4e16c666-7726-4cca-8e48-c822a6e49555/uploaded_media_1769454602323.png)

**Answer:**
1.  **Z-Index Layering:** The sidebar (`z-index: 1000`) sits above the navbar (where the hamburger button resides), so opening the sidebar obscures the only way to close it.
2.  **Fixed Positioning:** On mobile, the sidebar is `fixed`, which takes it out of flow, causing it to overlay the main content instead of pushing it.

**Resolution:**
1.  **Updated `AdminLayout.jsx`:**
    *   Added a visible **Close Button (X)** inside the sidebar header, visible only on mobile (`d-lg-none`).
    *   Added a backdrop **Overlay** (`.sidebar-overlay`) that covers the main content when the sidebar is open. Clicking this overlay also closes the sidebar.
2.  **Updated `AdminLayout.css`:**
    *   Styled the overlay with a semi-transparent black background and blur effect for better focus.
    *   Adjusted z-indices to ensure the overlay sits between the content and the sidebar.

---

## 7. Activity Logs Displaying Numeric Enums and "Invalid Date"

**Question:** Why did the System Activity Logs table show numeric values (0, 9, 10) instead of readable text, and why was the Time column showing "Invalid Date"?

![Activity Log Error Screenshot](C:/Users/arkks/.gemini/antigravity/brain/4e16c666-7726-4cca-8e48-c822a6e49555/uploaded_media_1769451794741.png)

**Answer:**
This issue was caused by two primary factors:
1.  **Enum Serialization:** By default, .NET serializes Enum properties as their underlying integer values (0, 1, 2...). The frontend expects string representations (e.g., "CREATE_USER").
2.  **Property Naming Mismatch:** The React frontend expected properties named `time`, `user`, and `status`, while the .NET backend was sending `CreatedAt`, `UserEmail`, and had no `status` field. The "Invalid Date" occurred because `log.time` was undefined.

**Resolution:**
1.  **Global Enum Config:** Updated `Program.cs` in the .NET service to include `JsonStringEnumConverter`, ensuring all Enums are returned as strings site-wide.
2.  **New DTO Layer:** Created `AuditLogDto.cs` in the .NET project to standardize the data structure.
3.  **Controller Mapping:** Updated `LogsController.cs` to map the `AuditLogs` entity to the `AuditLogDto`. This involved:
    *   Renaming `CreatedAt` to `Time`.
    *   Renaming `UserEmail` to `User`.
    *   Synthesizing a `Status` field (defaulting to "Success").
    *   Cleaning up Enum strings (e.g., converting `CREATE_USER` to `CREATE USER` for better readability).
