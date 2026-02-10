# API Endpoints Documentation

## Overview

This document provides a comprehensive list of all API endpoints available in the Online Examination Portal. The application consists of two backend services:

1. **Spring Boot Service** (Port 8080) - Main backend for authentication, courses, exams, questions, and results
2. **Admin Service (.NET)** (Port 7097) - Administrative operations for users, batches, announcements, and system settings

---

## Base URLs

- **Spring Boot API**: `http://localhost:8080/oep`
- **Admin Service API**: `http://localhost:7097`

---

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [User Management Endpoints](#user-management-endpoints)
3. [Course Management Endpoints](#course-management-endpoints)
4. [Exam Management Endpoints](#exam-management-endpoints)
5. [Question Management Endpoints](#question-management-endpoints)
6. [Result Management Endpoints](#result-management-endpoints)
7. [Batch Management Endpoints](#batch-management-endpoints)
8. [Announcement Endpoints](#announcement-endpoints)
9. [System Settings Endpoints](#system-settings-endpoints)
10. [Audit Log Endpoints](#audit-log-endpoints)
11. [Randomization Endpoints](#randomization-endpoints)
12. [Health Check Endpoints](#health-check-endpoints)

---

## Authentication Endpoints

### 1. User Login
**Endpoint**: `POST /auth/signin`  
**Service**: Spring Boot  
**Access**: Public  

**Description**: Authenticates a user and returns a JWT token.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "userId": 1,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "admin",
  "message": "Successfully logged in"
}
```

**How it works**:
- Validates user credentials using Spring Security's AuthenticationManager
- Generates a JWT token with user details (userId, email, role)
- Updates the user's last login timestamp
- Returns token and user information for frontend storage

---

### 2. Forgot Password
**Endpoint**: `POST /auth/forgot-password`  
**Service**: Spring Boot  
**Access**: Public  

**Description**: Sends a password reset link to the user's email.

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Reset link has been sent"
}
```

**How it works**:
- Validates that the email exists in the system
- Generates a unique reset token with expiration time
- Sends an email with a reset link containing the token
- Token is valid for a limited time (typically 1 hour)

---

### 3. Validate Reset Token
**Endpoint**: `GET /auth/reset-password/validate?token={token}`  
**Service**: Spring Boot  
**Access**: Public  

**Description**: Validates if a password reset token is valid and not expired.

**Query Parameters**:
- `token` (required): The reset token from the email link

**Response**:
```json
{
  "status": "success",
  "message": "Token is valid"
}
```

**How it works**:
- Checks if the token exists in the database
- Verifies the token hasn't expired
- Returns validation status

---

### 4. Reset Password
**Endpoint**: `POST /auth/reset-password`  
**Service**: Spring Boot  
**Access**: Public  

**Description**: Resets the user's password using a valid reset token.

**Request Body**:
```json
{
  "token": "reset-token-string",
  "newPassword": "newSecurePassword123"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Password reset successfully"
}
```

**How it works**:
- Validates the reset token
- Encrypts the new password using BCrypt
- Updates the user's password in the database
- Invalidates the reset token to prevent reuse

---

## User Management Endpoints

### 5. Get All Users
**Endpoint**: `GET /admin/users`  
**Service**: Admin Service (.NET)  
**Access**: Admin only  
**Authorization**: `ROLE_ADMIN`

**Description**: Retrieves a list of all users in the system.

**Query Parameters**:
- `role` (optional): Filter users by role (admin, instructor, student)

**Response**:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "userCode": "USR001",
    "role": "ROLE_STUDENT",
    "status": "ACTIVE",
    "batchId": 1,
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

**How it works**:
- Admin service proxies the request to Spring Boot backend
- Retrieves user data from the main database
- Optionally filters by role if specified
- Returns complete user information including batch associations

---

### 6. Get User by ID
**Endpoint**: `GET /admin/users/{id}`  
**Service**: Admin Service (.NET)  
**Access**: Admin only  
**Authorization**: `ROLE_ADMIN`

**Description**: Retrieves detailed information about a specific user.

**Path Parameters**:
- `id` (required): User ID

**Response**:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "userCode": "USR001",
  "role": "ROLE_STUDENT",
  "status": "ACTIVE",
  "batchId": 1,
  "createdAt": "2024-01-15T10:30:00"
}
```

**How it works**:
- Fetches user details from Spring Boot backend
- Returns 404 if user not found
- Includes batch information if user is a student

---

### 7. Create User
**Endpoint**: `POST /admin/users`  
**Service**: Admin Service (.NET)  
**Access**: Admin only  
**Authorization**: `ROLE_ADMIN`

**Description**: Creates a new user account in the system.

**Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "initialPassword123",
  "role": "ROLE_STUDENT",
  "status": "ACTIVE",
  "batchId": 1
}
```

**Response**:
```json
{
  "status": 200,
  "message": "User created Successfully."
}
```

**How it works**:
- Validates user data (email uniqueness, required fields)
- Generates a unique user code
- Encrypts the password using BCrypt
- Creates user record in Spring Boot database via proxy
- Logs the action in audit logs
- Sends welcome email to the new user

---

### 8. Update User
**Endpoint**: `PUT /admin/users/{id}`  
**Service**: Admin Service (.NET)  
**Access**: Admin only  
**Authorization**: `ROLE_ADMIN`

**Description**: Updates an existing user's information.

**Path Parameters**:
- `id` (required): User ID

**Request Body**:
```json
{
  "name": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "role": "ROLE_INSTRUCTOR",
  "status": "INACTIVE",
  "batchId": 2
}
```

**Response**:
```json
{
  "status": 200,
  "message": "User updated Successfully."
}
```

**How it works**:
- Validates the user exists
- Updates allowed fields (name, email, role, status, batch)
- Password is not updated through this endpoint
- Proxies update to Spring Boot backend
- Logs the action in audit logs

---

### 9. Delete User
**Endpoint**: `DELETE /admin/users/{id}`  
**Service**: Admin Service (.NET)  
**Access**: Admin only  
**Authorization**: `ROLE_ADMIN`

**Description**: Deletes a user from the system.

**Path Parameters**:
- `id` (required): User ID

**Response**:
```json
{
  "status": 200,
  "message": "User deleted Successfully."
}
```

**How it works**:
- Validates the user exists
- Checks for dependencies (enrolled courses, exam results)
- Performs soft delete or hard delete based on configuration
- Proxies deletion to Spring Boot backend
- Logs the action in audit logs

---

### 10. Get Instructor Profile
**Endpoint**: `GET /instructor/profile/{id}`  
**Service**: Spring Boot  
**Access**: Instructor only  
**Authorization**: `ROLE_INSTRUCTOR`

**Description**: Retrieves the instructor's profile information.

**Path Parameters**:
- `id` (required): Instructor user ID

**Response**:
```json
{
  "id": 2,
  "name": "Dr. Smith",
  "email": "smith@example.com",
  "userCode": "INS001",
  "role": "ROLE_INSTRUCTOR",
  "status": "ACTIVE"
}
```

**How it works**:
- Fetches user details from the database
- Returns only profile information (no sensitive data)
- Used for displaying instructor dashboard header

---

### 11. Get Student Profile
**Endpoint**: `GET /student/profile/{id}`  
**Service**: Spring Boot  
**Access**: Student only  
**Authorization**: `ROLE_STUDENT`

**Description**: Retrieves the student's profile information.

**Path Parameters**:
- `id` (required): Student user ID

**Response**:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "userCode": "STU001",
  "role": "ROLE_STUDENT",
  "status": "ACTIVE",
  "batchId": 1
}
```

**How it works**:
- Fetches user details from the database
- Includes batch information for students
- Used for displaying student dashboard header

---

## Course Management Endpoints

### 12. Get All Courses (Admin)
**Endpoint**: `GET /admin/courses`  
**Service**: Spring Boot  
**Access**: Admin only  
**Authorization**: `ROLE_ADMIN`

**Description**: Retrieves all courses in the system for administrative purposes.

**Response**:
```json
[
  {
    "id": 1,
    "title": "Introduction to Java",
    "courseCode": "CS101",
    "description": "Learn Java programming basics",
    "credits": 3,
    "status": "ACTIVE",
    "instructorId": 2,
    "instructorName": "Dr. Smith",
    "outcomes": ["Understand OOP", "Write Java programs"],
    "createdAt": "2024-01-10T09:00:00"
  }
]
```

**How it works**:
- Fetches all courses from the database
- Includes instructor information
- Shows all statuses (ACTIVE, INACTIVE, ARCHIVED)
- Used for admin course management dashboard

---

### 13. Get Course by ID (Admin)
**Endpoint**: `GET /admin/courses/{id}`  
**Service**: Spring Boot  
**Access**: Admin only  
**Authorization**: `ROLE_ADMIN`

**Description**: Retrieves detailed information about a specific course.

**Path Parameters**:
- `id` (required): Course ID

**Response**:
```json
{
  "id": 1,
  "title": "Introduction to Java",
  "courseCode": "CS101",
  "description": "Learn Java programming basics",
  "credits": 3,
  "status": "ACTIVE",
  "instructorId": 2,
  "instructorName": "Dr. Smith",
  "outcomes": ["Understand OOP", "Write Java programs"],
  "syllabus": [],
  "createdAt": "2024-01-10T09:00:00"
}
```

**How it works**:
- Fetches course details including syllabus
- Returns 404 if course not found
- Includes complete course information for editing

---

### 14. Get Instructor Courses
**Endpoint**: `GET /instructor/courses/{instructorId}`  
**Service**: Spring Boot  
**Access**: Instructor only  
**Authorization**: `ROLE_INSTRUCTOR`

**Description**: Retrieves all courses assigned to a specific instructor.

**Path Parameters**:
- `instructorId` (required): Instructor user ID

**Response**:
```json
[
  {
    "id": 1,
    "title": "Introduction to Java",
    "courseCode": "CS101",
    "description": "Learn Java programming basics",
    "credits": 3,
    "status": "ACTIVE",
    "outcomes": ["Understand OOP", "Write Java programs"]
  }
]
```

**How it works**:
- Filters courses by instructor ID
- Returns only ACTIVE courses
- Used for instructor dashboard course list

---

### 15. Get Student Enrolled Courses
**Endpoint**: `GET /student/courses/{studentId}`  
**Service**: Spring Boot  
**Access**: Student only  
**Authorization**: `ROLE_STUDENT`

**Description**: Retrieves all courses a student is enrolled in.

**Path Parameters**:
- `studentId` (required): Student user ID

**Response**:
```json
[
  {
    "id": 1,
    "title": "Introduction to Java",
    "courseCode": "CS101",
    "description": "Learn Java programming basics",
    "credits": 3,
    "instructorName": "Dr. Smith",
    "enrolledDate": "2024-01-15T10:00:00"
  }
]
```

**How it works**:
- Joins enrollments table with courses
- Returns courses where student has active enrollment
- Includes instructor information

---

### 16. Get Available Courses for Student
**Endpoint**: `GET /student/courses/available/{studentId}`  
**Service**: Spring Boot  
**Access**: Student only  
**Authorization**: `ROLE_STUDENT`

**Description**: Retrieves courses available for enrollment (not yet enrolled).

**Path Parameters**:
- `studentId` (required): Student user ID

**Response**:
```json
[
  {
    "id": 2,
    "title": "Data Structures",
    "courseCode": "CS201",
    "description": "Learn data structures and algorithms",
    "credits": 4,
    "instructorName": "Dr. Johnson"
  }
]
```

**How it works**:
- Fetches all ACTIVE courses
- Excludes courses student is already enrolled in
- Used for course enrollment page

---

### 17. Enroll in Course
**Endpoint**: `POST /student/courses/{courseId}/enroll/{studentId}`  
**Service**: Spring Boot  
**Access**: Student only  
**Authorization**: `ROLE_STUDENT`

**Description**: Enrolls a student in a specific course.

**Path Parameters**:
- `courseId` (required): Course ID
- `studentId` (required): Student user ID

**Response**:
```json
{
  "status": "success",
  "message": "Enrolled successfully"
}
```

**How it works**:
- Validates course exists and is ACTIVE
- Checks student is not already enrolled
- Creates enrollment record with current timestamp
- Returns success confirmation

---

### 18. Get Course by ID
**Endpoint**: `GET /courses/{id}`  
**Service**: Spring Boot  
**Access**: Authenticated users  
**Authorization**: `ROLE_ADMIN, ROLE_INSTRUCTOR, ROLE_STUDENT`

**Description**: Retrieves course details accessible to all authenticated users.

**Path Parameters**:
- `id` (required): Course ID

**Response**:
```json
{
  "id": 1,
  "title": "Introduction to Java",
  "courseCode": "CS101",
  "description": "Learn Java programming basics",
  "credits": 3,
  "status": "ACTIVE",
  "instructorName": "Dr. Smith",
  "outcomes": ["Understand OOP", "Write Java programs"]
}
```

**How it works**:
- Fetches course details from database
- Returns 404 if not found
- Used for course detail pages

---

### 19. Create Course (Admin)
**Endpoint**: `POST /admin/courses`  
**Service**: Spring Boot  
**Access**: Admin only  
**Authorization**: `ROLE_ADMIN`

**Description**: Creates a new course in the system.

**Request Body**:
```json
{
  "title": "Advanced Python",
  "courseCode": "CS301",
  "description": "Advanced Python programming concepts",
  "credits": 4,
  "instructorId": 2,
  "status": "ACTIVE",
  "outcomes": ["Master decorators", "Understand async programming"]
}
```

**Response**:
```json
{
  "id": 3,
  "title": "Advanced Python",
  "courseCode": "CS301",
  "description": "Advanced Python programming concepts",
  "credits": 4,
  "status": "ACTIVE",
  "instructorId": 2
}
```

**How it works**:
- Validates course code is unique
- Validates instructor exists
- Creates course record in database
- Returns created course with generated ID

---

### 20. Update Course (Admin)
**Endpoint**: `PUT /admin/courses/{id}`  
**Service**: Spring Boot  
**Access**: Admin only  
**Authorization**: `ROLE_ADMIN`

**Description**: Updates an existing course.

**Path Parameters**:
- `id` (required): Course ID

**Request Body**:
```json
{
  "title": "Advanced Python Programming",
  "courseCode": "CS301",
  "description": "Updated description",
  "credits": 4,
  "instructorId": 2,
  "status": "ACTIVE"
}
```

**Response**:
```json
{
  "id": 3,
  "title": "Advanced Python Programming",
  "courseCode": "CS301",
  "description": "Updated description",
  "credits": 4,
  "status": "ACTIVE"
}
```

**How it works**:
- Validates course exists
- Updates course fields
- Maintains enrollment relationships
- Returns updated course

---

### 21. Update Course Status
**Endpoint**: `PATCH /admin/courses/{id}/status`  
**Service**: Spring Boot  
**Access**: Admin only  
**Authorization**: `ROLE_ADMIN`

**Description**: Updates only the status of a course.

**Path Parameters**:
- `id` (required): Course ID

**Request Body**:
```json
{
  "status": "INACTIVE"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Status updated successfully"
}
```

**How it works**:
- Validates course exists
- Updates only the status field
- Used for quick status toggles

---

### 22. Delete Course
**Endpoint**: `DELETE /admin/courses/{id}`  
**Service**: Spring Boot  
**Access**: Admin only  
**Authorization**: `ROLE_ADMIN`

**Description**: Deletes a course from the system.

**Path Parameters**:
- `id` (required): Course ID

**Response**: `204 No Content`

**How it works**:
- Validates course exists
- Checks for dependencies (enrollments, exams)
- Performs cascading delete or soft delete
- Returns no content on success

---

### 23. Get Course Syllabus
**Endpoint**: `GET /courses/{courseId}/syllabus`  
**Service**: Spring Boot  
**Access**: Authenticated users  
**Authorization**: `ROLE_ADMIN, ROLE_INSTRUCTOR, ROLE_STUDENT`

**Description**: Retrieves the syllabus for a specific course.

**Path Parameters**:
- `courseId` (required): Course ID

**Response**:
```json
{
  "content": [
    {
      "week": 1,
      "topic": "Introduction to Java",
      "description": "Basic syntax and concepts"
    },
    {
      "week": 2,
      "topic": "Object-Oriented Programming",
      "description": "Classes, objects, inheritance"
    }
  ]
}
```

**How it works**:
- Fetches syllabus data from course record
- Returns empty array if no syllabus defined
- Used for displaying course syllabus page

---

### 24. Update Course Syllabus
**Endpoint**: `POST /courses/{courseId}/syllabus`  
**Service**: Spring Boot  
**Access**: Instructor, Admin  
**Authorization**: `ROLE_ADMIN, ROLE_INSTRUCTOR`

**Description**: Updates the syllabus content for a course.

**Path Parameters**:
- `courseId` (required): Course ID

**Request Body**:
```json
{
  "content": [
    {
      "week": 1,
      "topic": "Introduction",
      "description": "Course overview"
    }
  ]
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Syllabus updated successfully"
}
```

**How it works**:
- Validates course exists
- Replaces existing syllabus with new content
- Stores as JSON in database

---

### 25. Update Course Outcomes
**Endpoint**: `POST /courses/{courseId}/outcomes`  
**Service**: Spring Boot  
**Access**: Instructor, Admin  
**Authorization**: `ROLE_ADMIN, ROLE_INSTRUCTOR`

**Description**: Updates the learning outcomes for a course.

**Path Parameters**:
- `courseId` (required): Course ID

**Request Body**:
```json
{
  "outcomes": [
    "Understand Java fundamentals",
    "Write object-oriented programs",
    "Debug Java applications"
  ]
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Outcomes updated successfully"
}
```

**How it works**:
- Validates course exists
- Updates outcomes array
- Stores as JSON array in database

---

## Exam Management Endpoints

### 26. Get All Exams (Admin)
**Endpoint**: `GET /admin/exams`  
**Service**: Spring Boot  
**Access**: Admin only  
**Authorization**: `ROLE_ADMIN`

**Description**: Retrieves all exams in the system.

**Response**:
```json
[
  {
    "id": 1,
    "examTitle": "Java Midterm",
    "courseId": 1,
    "scheduledDate": "2024-02-15",
    "startTime": "10:00:00",
    "endTime": "12:00:00",
    "duration": 120,
    "totalMarks": 100,
    "passingMarks": 40,
    "status": "SCHEDULED",
    "totalQuestions": 50
  }
]
```

**How it works**:
- Fetches all exams from database
- Calculates total marks from exam questions
- Includes course and instructor details
- Shows all exam statuses

---

### 27. Get Instructor Exams
**Endpoint**: `GET /instructor/exams/{instructorId}`  
**Service**: Spring Boot  
**Access**: Instructor only  
**Authorization**: `ROLE_INSTRUCTOR`

**Description**: Retrieves all exams created by a specific instructor.

**Path Parameters**:
- `instructorId` (required): Instructor user ID

**Response**:
```json
[
  {
    "id": 1,
    "examTitle": "Java Midterm",
    "scheduledDate": "2024-02-15",
    "startTime": "10:00:00",
    "endTime": "12:00:00",
    "duration": 120,
    "totalMarks": 100,
    "passingMarks": 40,
    "status": "SCHEDULED",
    "totalQuestions": 50,
    "resultPublished": false,
    "answerReviewAllowed": false,
    "scorecardReleased": false,
    "course": {
      "id": 1,
      "title": "Introduction to Java",
      "courseCode": "CS101"
    }
  }
]
```

**How it works**:
- Filters exams by instructor ID
- Joins with course table for course details
- Calculates total marks from associated questions
- Used for instructor exam management dashboard

---

### 28. Get Student Exams
**Endpoint**: `GET /student/exams/{studentId}`  
**Service**: Spring Boot  
**Access**: Student only  
**Authorization**: `ROLE_STUDENT`

**Description**: Retrieves exams available to a student based on course enrollments.

**Path Parameters**:
- `studentId` (required): Student user ID

**Response**:
```json
[
  {
    "id": 1,
    "examTitle": "Java Midterm",
    "scheduledDate": "2024-02-15",
    "startTime": "10:00:00",
    "endTime": "12:00:00",
    "duration": 120,
    "totalMarks": 100,
    "passingMarks": 40,
    "status": "SCHEDULED",
    "totalQuestions": 50
  }
]
```

**How it works**:
- Finds courses student is enrolled in
- Fetches exams for those courses
- Filters by exam status (SCHEDULED, ONGOING)
- Used for student exam list page

---

### 29. Get Available Exams for Student
**Endpoint**: `GET /student/exams/available/{studentId}`  
**Service**: Spring Boot  
**Access**: Student only  
**Authorization**: `ROLE_STUDENT`

**Description**: Retrieves exams that are currently available for the student to take.

**Path Parameters**:
- `studentId` (required): Student user ID

**Response**:
```json
[
  {
    "id": 1,
    "examTitle": "Java Midterm",
    "scheduledDate": "2024-02-15",
    "startTime": "10:00:00",
    "endTime": "12:00:00",
    "duration": 120,
    "totalMarks": 100,
    "passingMarks": 40,
    "status": "ONGOING",
    "totalQuestions": 50
  }
]
```

**How it works**:
- Filters exams by current date/time
- Excludes already attempted exams
- Returns only ONGOING or SCHEDULED exams
- Used for "Take Exam" page

---

### 30. Get Exam by ID
**Endpoint**: `GET /exams/{id}`  
**Service**: Spring Boot  
**Access**: Authenticated users  
**Authorization**: `ROLE_ADMIN, ROLE_INSTRUCTOR, ROLE_STUDENT`

**Description**: Retrieves detailed information about a specific exam.

**Path Parameters**:
- `id` (required): Exam ID

**Response**:
```json
{
  "id": 1,
  "examTitle": "Java Midterm",
  "scheduledDate": "2024-02-15",
  "startTime": "10:00:00",
  "endTime": "12:00:00",
  "duration": 120,
  "totalMarks": 100,
  "passingMarks": 40,
  "status": "SCHEDULED",
  "totalQuestions": 50,
  "examPassword": "EXAM2024",
  "course": {
    "id": 1,
    "title": "Introduction to Java",
    "courseCode": "CS101"
  }
}
```

**How it works**:
- Fetches exam details from database
- Calculates total marks from questions
- Includes course information
- Returns 404 if not found

---

### 31. Create Exam
**Endpoint**: `POST /instructor/exams`  
**Service**: Spring Boot  
**Access**: Instructor only  
**Authorization**: `ROLE_INSTRUCTOR`

**Description**: Creates a new exam.

**Request Body**:
```json
{
  "examTitle": "Java Final Exam",
  "courseId": 1,
  "instructorId": 2,
  "scheduledDate": "2024-03-20",
  "startTime": "14:00:00",
  "endTime": "16:00:00",
  "duration": 120,
  "passingMarks": 40,
  "status": "SCHEDULED",
  "examPassword": "FINAL2024"
}
```

**Response**:
```json
{
  "id": 2,
  "examTitle": "Java Final Exam",
  "scheduledDate": "2024-03-20",
  "startTime": "14:00:00",
  "endTime": "16:00:00",
  "duration": 120,
  "passingMarks": 40,
  "status": "SCHEDULED"
}
```

**How it works**:
- Validates course and instructor exist
- Creates exam record in database
- Generates unique exam ID
- Questions are added separately via add question endpoint

---

### 32. Update Exam
**Endpoint**: `PUT /instructor/exams/{id}`  
**Service**: Spring Boot  
**Access**: Instructor only  
**Authorization**: `ROLE_INSTRUCTOR`

**Description**: Updates an existing exam.

**Path Parameters**:
- `id` (required): Exam ID

**Request Body**:
```json
{
  "examTitle": "Java Final Exam - Updated",
  "scheduledDate": "2024-03-21",
  "startTime": "15:00:00",
  "endTime": "17:00:00",
  "duration": 120,
  "passingMarks": 45,
  "status": "SCHEDULED"
}
```

**Response**:
```json
{
  "id": 2,
  "examTitle": "Java Final Exam - Updated",
  "scheduledDate": "2024-03-21",
  "status": "SCHEDULED"
}
```

**How it works**:
- Validates exam exists and belongs to instructor
- Updates exam fields
- Cannot update if exam is COMPLETED
- Maintains question associations

---

### 33. Delete Exam
**Endpoint**: `DELETE /admin/exams/{id}` or `DELETE /instructor/exams/{id}`  
**Service**: Spring Boot  
**Access**: Admin or Instructor  
**Authorization**: `ROLE_ADMIN, ROLE_INSTRUCTOR`

**Description**: Deletes an exam from the system.

**Path Parameters**:
- `id` (required): Exam ID

**Response**: `204 No Content`

**How it works**:
- Validates exam exists
- Checks if exam has been attempted
- Performs cascading delete of exam questions
- Returns no content on success

---

### 34. Add Question to Exam
**Endpoint**: `POST /instructor/exams/{examId}/questions/{questionId}`  
**Service**: Spring Boot  
**Access**: Instructor only  
**Authorization**: `ROLE_INSTRUCTOR`

**Description**: Adds a question to an exam.

**Path Parameters**:
- `examId` (required): Exam ID
- `questionId` (required): Question ID

**Response**: `200 OK`

**How it works**:
- Validates exam and question exist
- Creates exam_questions association
- Prevents duplicate question additions
- Updates exam total marks automatically

---

### 35. Remove Question from Exam
**Endpoint**: `DELETE /instructor/exams/{examId}/questions/{questionId}`  
**Service**: Spring Boot  
**Access**: Instructor only  
**Authorization**: `ROLE_INSTRUCTOR`

**Description**: Removes a question from an exam.

**Path Parameters**:
- `examId` (required): Exam ID
- `questionId` (required): Question ID

**Response**: `200 OK`

**How it works**:
- Validates association exists
- Removes exam_questions record
- Updates exam total marks
- Cannot remove if exam is completed

---

### 36. Verify Exam Password
**Endpoint**: `POST /student/exams/{examId}/verify-password`  
**Service**: Spring Boot  
**Access**: Student only  
**Authorization**: `ROLE_STUDENT`

**Description**: Verifies the exam password before allowing student to start.

**Path Parameters**:
- `examId` (required): Exam ID

**Request Body**:
```json
{
  "password": "EXAM2024"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Password verified"
}
```

**How it works**:
- Fetches exam password from database
- Compares with provided password
- Returns 401 if password is incorrect
- Used before starting exam

---

### 37. Submit Exam
**Endpoint**: `POST /student/exams/{examId}/submissions`  
**Service**: Spring Boot  
**Access**: Student only  
**Authorization**: `ROLE_STUDENT`

**Description**: Submits student answers for an exam.

**Path Parameters**:
- `examId` (required): Exam ID

**Request Body**:
```json
{
  "studentId": 1,
  "answers": {
    "101": "Option A",
    "102": "Option B",
    "103": "True"
  }
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Exam submitted successfully"
}
```

**How it works**:
- Validates exam is ongoing
- Stores each answer in student_answers table
- Calculates marks for objective questions
- Creates exam_results record
- Marks exam as completed for student

---

### 38. Get Exam Questions (Instructor)
**Endpoint**: `GET /instructor/exams/{examId}/questions`  
**Service**: Spring Boot  
**Access**: Instructor only  
**Authorization**: `ROLE_INSTRUCTOR`

**Description**: Retrieves all questions associated with an exam for instructor view.

**Path Parameters**:
- `examId` (required): Exam ID

**Response**:
```json
[
  {
    "question": {
      "id": 101,
      "questionText": "What is polymorphism?",
      "type": "MCQ",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswers": ["Option A"],
      "marksAllotted": 2
    }
  }
]
```

**How it works**:
- Fetches exam_questions associations
- Includes complete question details
- Shows correct answers (instructor view)
- Used for exam preview and management

---

### 39. Get Exam Questions (Student)
**Endpoint**: `GET /student/exams/{examId}/questions`  
**Service**: Spring Boot  
**Access**: Student only  
**Authorization**: `ROLE_STUDENT`

**Description**: Retrieves exam questions for student to answer (without correct answers).

**Path Parameters**:
- `examId` (required): Exam ID

**Response**:
```json
[
  {
    "id": 101,
    "questionText": "What is polymorphism?",
    "type": "MCQ",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "marksAllotted": 2
  },
  {
    "id": 102,
    "questionText": "Match the following",
    "type": "MATCHING",
    "leftItems": ["Java", "Python", "C++"],
    "rightItems": ["Interpreted", "Compiled", "Hybrid"],
    "marksAllotted": 3
  }
]
```

**How it works**:
- Fetches exam questions without correct answers
- Shuffles matching pairs for MATCHING type questions
- Randomizes option order if configured
- Used during exam taking

---

### 40. Report Exam Violation
**Endpoint**: `POST /student/exams/{examId}/report-violation`  
**Service**: Spring Boot  
**Access**: Student only  
**Authorization**: `ROLE_STUDENT`

**Description**: Reports a proctoring violation during exam (tab switch, fullscreen exit).

**Path Parameters**:
- `examId` (required): Exam ID

**Request Body**:
```json
{
  "studentId": 1,
  "violationType": "TAB_SWITCH",
  "timestamp": "2024-02-15T10:30:45"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Violation reported"
}
```

**How it works**:
- Creates violation record in database
- Logs timestamp and violation type
- Used for proctoring monitoring
- Instructor can view violations later

---

### 41. Get Exam Results (Instructor)
**Endpoint**: `GET /instructor/exams/{examId}/results`  
**Service**: Spring Boot  
**Access**: Instructor only  
**Authorization**: `ROLE_INSTRUCTOR`

**Description**: Retrieves all student results for a specific exam.

**Path Parameters**:
- `examId` (required): Exam ID

**Response**:
```json
[
  {
    "id": 1,
    "totalScore": 85,
    "totalMarks": 100,
    "status": "PASS",
    "isEvaluated": true,
    "submittedAt": "2024-02-15T11:45:00",
    "student": {
      "id": 1,
      "userName": "John Doe",
      "userCode": "STU001"
    }
  }
]
```

**How it works**:
- Fetches all exam_results for the exam
- Includes student information
- Shows evaluation status
- Used for result management page

---

### 42. Update Exam Settings
**Endpoint**: `PATCH /instructor/exams/{examId}/settings`  
**Service**: Spring Boot  
**Access**: Instructor only  
**Authorization**: `ROLE_INSTRUCTOR`

**Description**: Updates exam settings like result publication, answer review, scorecard release.

**Path Parameters**:
- `examId` (required): Exam ID

**Request Body**:
```json
{
  "resultPublished": true,
  "answerReviewAllowed": true,
  "scorecardReleased": true
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Settings updated"
}
```

**How it works**:
- Updates exam configuration flags
- Controls student access to results
- Enables/disables answer review
- Controls scorecard download availability

---

