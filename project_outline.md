# Project Outline: Online Examination Portal

The **Online Examination Portal** is a distributed web application designed for secure exam administration, student evaluation, and course management.

## System Architecture

The project utilizes a hybrid micro-service architecture:

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, Axios | User interface and client-side logic. |
| **Admin Service** | .NET 8, EF Core | Proxy layer for administrative tasks and specialized batch logic. |
| **Main Backend** | Spring Boot, Spring Security | Core business logic, authentication (JWT), and examination engine. |
| **Database** | MySQL | Centralized storage for users, courses, batches, and results. |

## Feature Overview

### 1. Administrative Features
- **User Lifecycle**: Create, update, and manage accounts for Admin, Instructors, and Students.
- **Batch Management**: Organize students into cohorts for specific examinations.
- **Audit Logging**: Trace all critical system actions for security compliance.

### 2. Instructor Capabilities
- **Course Control**: Manage assigned curriculum and student lists.
- **Exam Creation**: Build structured assessments with varied question types.
- **Result Analysis**: View and evaluate student performance metrics.

### 3. Student Experience
- **Exam Dashboard**: View upcoming scheduled tests.
- **Secure Testing**: Take exams within a protected session.
- **Immediate Results**: View scores and feedback upon test completion.

## Data Flow Logic
1.  **Auth**: All services share a central JWT-based authentication protocol managed by the Spring backend.
2.  **Proxying**: Administrative requests from the frontend often pass through the .NET Proxy Service before reaching the Spring business layer or directly interacting with Batch tables.
3.  **Security**: Implements fine-grained Role-Based Access Control (RBAC) at both the API and UI levels.
