# Backend Checklist (Page-by-Page)

This frontend currently uses mock data + local storage for demo flows. Below is what the backend should provide so the frontend can be wired to real APIs with minimal changes.

## 1) Authentication & Account

**Features**
- Centralized login by email/password
- Role-based routing (Admin/Instructor/Student)
- Forgot password (email → OTP/code → reset password)
- Logout (invalidate session/token)

**APIs**
- `POST /api/auth/login`
  - Body: `{ email, password }`
  - Returns: `{ user: { id, name, email, role }, token, expiresAt }`
- `POST /api/auth/logout`
  - Header: `Authorization: Bearer <token>`
  - Returns: `{ success: true }`
- `POST /api/auth/forgot-password`
  - Body: `{ email }`
  - Returns: `{ success: true }`
  - Sends: OTP/code to email
- `POST /api/auth/verify-reset-code`
  - Body: `{ email, code }`
  - Returns: `{ resetToken }` (short-lived)
- `POST /api/auth/reset-password`
  - Body: `{ email, resetToken, newPassword }`
  - Returns: `{ success: true }`

**Backend logic**
- Password hashing (bcrypt/argon2), lockout / throttling, audit logging
- JWT or session store (recommended: refresh token + access token)
- Email provider integration (SMTP/SendGrid/etc.)

## 2) Admin Module

### Admin Dashboard (`/admin/dashboard`)
**Data needed**
- Total users by role, active sessions, exams overview, flagged events

**APIs**
- `GET /api/admin/dashboard`

### Users (`/admin/users`)
**Features**
- List/search/filter users, view details, edit user, create user

**APIs**
- `GET /api/admin/users?query=&role=&status=&page=&pageSize=`
- `POST /api/admin/users`
- `GET /api/admin/users/:id`
- `PUT /api/admin/users/:id`
- `PATCH /api/admin/users/:id/status` (enable/disable)

### User Details + Activity (`/admin/users/:id`)
**Features**
- Show basic user info
- Show user activity logs (login/logout, profile update, exam actions)

**APIs**
- `GET /api/admin/users/:id/activity?from=&to=&page=&pageSize=`

### Activity Logs (`/admin/logs`)
**Features**
- Filter logs by role, action, user, exam

**APIs**
- `GET /api/admin/logs?role=&action=&query=&examId=&from=&to=&page=&pageSize=`

**Log schema (suggested)**
- `id, time, userId, role, action, status, examId?, ip?, userAgent?, metadata?`

### Exam Governance (`/admin/exams`)
**Features**
- List exams, change status, view logs for a selected exam

**APIs**
- `GET /api/admin/exams?status=&query=&page=&pageSize=`
- `POST /api/admin/exams/:examId/extend-time` (or `PATCH`)
- `POST /api/admin/exams/:examId/cancel` (or `PATCH`)
- `GET /api/admin/exams/:examId/logs`

### Course Governance (`/admin/courses`)
**APIs**
- `GET /api/admin/courses`
- `POST /api/admin/courses`
- `PUT /api/admin/courses/:courseId`

### Analytics (`/admin/analytics`)
**APIs**
- `GET /api/admin/analytics?from=&to=`
  - Provide time-series for signups, attempts, pass/fail, violations, etc.

### Settings (`/admin/settings`)
**APIs**
- `GET /api/admin/settings`
- `PUT /api/admin/settings`

## 3) Instructor Module

### Instructor Dashboard (`/instructor/home`)
**APIs**
- `GET /api/instructor/dashboard`

### Course Management (`/instructor/courses`)
**Features**
- List assigned courses
- View enrolled students
- Upload syllabus + edit content
- Define outcomes

**APIs**
- `GET /api/instructor/courses`
- `GET /api/instructor/courses/:courseId/students`
- `GET /api/instructor/courses/:courseId/syllabus`
- `PUT /api/instructor/courses/:courseId/syllabus`
- `POST /api/instructor/courses/:courseId/syllabus/upload` (file)
- `GET /api/instructor/courses/:courseId/outcomes`
- `PUT /api/instructor/courses/:courseId/outcomes`

### Exam Management (`/instructor/exams`)
**Features**
- Create/edit exams
- View details
- Clone exam
- Add questions to exam (all supported types)

**APIs**
- `GET /api/instructor/exams`
- `POST /api/instructor/exams`
- `GET /api/instructor/exams/:examId`
- `PUT /api/instructor/exams/:examId`
- `POST /api/instructor/exams/:examId/clone`
- `POST /api/instructor/exams/:examId/questions` (attach from bank or create new)
- `DELETE /api/instructor/exams/:examId/questions/:questionId`

### Live Monitoring (`/instructor/live-exams`)
**APIs**
- `GET /api/instructor/live-exams`
- `GET /api/instructor/live-exams/:examId/violations`
- Optional real-time: WebSocket `/ws/exams/:examId`

### Result Evaluation (`/instructor/results`)
**Features**
- See past exams, open an exam, adjust evaluation controls

**APIs**
- `GET /api/instructor/exams?status=completed`
- `GET /api/instructor/exams/:examId/submissions`
- `PATCH /api/instructor/exams/:examId/submissions/:attemptId/score`
- `POST /api/instructor/exams/:examId/publish-results`

### Question Bank (`/instructor/question-bank`)
**Features**
- List per course
- Create questions (MCQ single/multi, true/false, etc.)
- Edit/delete questions
- Tags and randomization rules

**APIs**
- `GET /api/instructor/question-bank/courses`
- `GET /api/instructor/question-bank/:courseCode/questions`
- `POST /api/instructor/question-bank/:courseCode/questions`
- `PUT /api/instructor/question-bank/:courseCode/questions/:questionId`
- `DELETE /api/instructor/question-bank/:courseCode/questions/:questionId`
- `GET /api/instructor/question-bank/:courseCode/tags`
- `PUT /api/instructor/question-bank/:courseCode/tags`
- `GET /api/instructor/question-bank/:courseCode/randomization`
- `PUT /api/instructor/question-bank/:courseCode/randomization`

### Instructor Profile (`/instructor/profile`)
**APIs**
- `GET /api/instructor/profile`
- `PUT /api/instructor/profile`
- `PUT /api/instructor/profile/password`

## 4) Student Module

### Student Overview (`/student/home`)
**APIs**
- `GET /api/student/overview`

### Profile (`/student/profile`)
**APIs**
- `GET /api/student/profile`
- `PUT /api/student/profile`
- `POST /api/student/profile/photo` (file)

### Courses (`/student/courses`)
**APIs**
- `GET /api/student/courses`

### Exams List (`/student/exams`)
**APIs**
- `GET /api/student/exams`

### Exam Instructions + Details (`/student/exams/:examId/instructions`, `/details`)
**APIs**
- `GET /api/student/exams/:examId`
- If using exam password: `POST /api/student/exams/:examId/verify-access`

### Attempt Exam (`/student/exams/:examId/attempt`)
**APIs**
- `GET /api/student/exams/:examId/questions` (deliver randomized set)
- `POST /api/student/exams/:examId/heartbeat` (optional anti-cheat)
- `POST /api/student/exams/:examId/violations` (tab switch, fullscreen exit, etc.)
- `POST /api/student/exams/:examId/submit`
  - Body: `{ answers, startedAt, submittedAt, violations }`

### Exam History (`/student/exam-history`)
**APIs**
- `GET /api/student/exams/history`

### Results (`/student/results`, `/student/exams/:examId/result`)
**APIs**
- `GET /api/student/results`
- `GET /api/student/exams/:examId/result`

### Change Password (`/student/change-password`)
**APIs**
- `PUT /api/student/profile/password`

## 5) Shared / Cross-cutting

**Must-have**
- RBAC (role checks on every endpoint)
- Validation and consistent error formats
- Audit logs (who did what, when, and from where)
- Pagination, filtering, sorting
- File storage for uploads (syllabus, profile photos) via S3/local

