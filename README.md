# 🎓 Online Examination Portal

A comprehensive, enterprise-grade web application for conducting secure online examinations with role-based access control, real-time proctoring, and advanced analytics.

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## 🌟 Overview

The **Online Examination Portal** is a distributed microservices-based application designed to facilitate secure, scalable, and feature-rich online examination management. It supports three distinct user roles (Admin, Instructor, Student) with comprehensive functionality for exam creation, administration, proctoring, and result analysis.

### Core Capabilities

- **Multi-Role Access Control**: Separate dashboards and permissions for Admins, Instructors, and Students
- **Secure Authentication**: JWT-based authentication with password reset functionality
- **Exam Proctoring**: Real-time monitoring with tab-switch detection and fullscreen enforcement
- **Question Bank Management**: Support for multiple question types (MCQ, True/False, Fill-in-the-Blank, Matching)
- **Automated Grading**: Instant result calculation with detailed scorecards
- **Batch Management**: Organize students into cohorts for targeted exam administration
- **Analytics Dashboard**: Comprehensive performance metrics and reporting

---

## 🏗️ System Architecture

The application follows a **hybrid microservices architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                   │
│                    Port: 5173 (Development)                 │
└────────────┬────────────────────────────────┬───────────────┘
             │                                │
             ▼                                ▼
┌────────────────────────┐      ┌────────────────────────────┐
│  Admin Service (.NET)  │      │  Spring Boot Backend       │
│      Port: 7097        │◄────►│      Port: 8080            │
│  - Batch Management    │      │  - Authentication (JWT)    │
│  - Announcements       │      │  - Exam Engine             │
│  - System Settings     │      │  - Question Bank           │
│  - Audit Logs          │      │  - Result Processing       │
│  - User Proxy          │      │  - Course Management       │
└────────────┬───────────┘      └────────────┬───────────────┘
             │                                │
             ▼                                ▼
┌────────────────────────┐      ┌────────────────────────────┐
│  MySQL (Admin DB)      │      │  MySQL (Main DB)           │
│      Port: 3307        │      │      Port: 3306            │
│  - Batches             │      │  - Users                   │
│  - Announcements       │      │  - Courses                 │
│  - System Settings     │      │  - Exams                   │
│  - Audit Logs          │      │  - Questions               │
└────────────────────────┘      │  - Results                 │
                                │  - Enrollments             │
                                └────────────────────────────┘
```

### Architecture Highlights

- **Frontend**: React 19 with Vite for fast development and optimized builds
- **Admin Service**: .NET 8 with Entity Framework Core for administrative operations
- **Main Backend**: Spring Boot 3.5.9 with Spring Security for core business logic
- **Database**: MySQL 8.0 with separate databases for service isolation
- **Communication**: RESTful APIs with JWT token-based authentication
- **Containerization**: Docker support with docker-compose for easy deployment

---

## ✨ Key Features

### 👨‍💼 Admin Features

- **User Management**
  - Create, update, and delete users (Admin, Instructor, Student)
  - Assign roles and batch associations
  - Manage user status (Active/Inactive)
  
- **Batch Management**
  - Create and manage student batches
  - Define batch timelines (start/end dates)
  - Track batch-specific enrollments

- **Course Governance**
  - Oversee all courses in the system
  - Manage course status and assignments
  - Delete or suspend courses

- **Exam Oversight**
  - View all scheduled exams
  - Cancel exams if necessary
  - Monitor exam results across the system

- **System Configuration**
  - Configure proctoring settings (tab-switch detection, fullscreen mode)
  - Enable/disable maintenance mode
  - Manage system-wide announcements

- **Audit & Analytics**
  - Comprehensive audit logs for all system actions
  - Dashboard with key performance indicators
  - User activity tracking

### 👨‍🏫 Instructor Features

- **Course Management**
  - View assigned courses
  - Update course syllabus and learning outcomes
  - Manage course enrollments

- **Question Bank**
  - Create questions with multiple types:
    - Multiple Choice Questions (MCQ)
    - True/False
    - Fill in the Blanks
    - Matching Pairs
  - Set difficulty levels (Easy, Medium, Hard)
  - Assign marks per question
  - Tag questions for categorization
  - Bulk import questions via file upload

- **Exam Creation & Management**
  - Schedule exams with date/time constraints
  - Set exam duration and passing criteria
  - Configure randomization rules for question selection
  - Set exam passwords for security
  - Define proctoring rules per exam

- **Live Exam Monitoring**
  - Real-time student participation tracking
  - Monitor exam violations (tab switches, fullscreen exits)
  - View live exam statistics

- **Result Evaluation**
  - Automatic grading for objective questions
  - View detailed student performance
  - Export results to PDF
  - Analyze performance trends

- **Student Performance Analytics**
  - Course-wise performance metrics
  - Individual student progress tracking
  - Comparative analysis

### 👨‍🎓 Student Features

- **Dashboard**
  - Personal performance overview
  - Upcoming exam schedule
  - Recent announcements

- **Course Enrollment**
  - Browse available courses
  - Self-enroll in courses
  - View enrolled courses and syllabi

- **Exam Taking**
  - Secure exam interface with password protection
  - Timer-based exam sessions
  - Support for all question types
  - Auto-save functionality
  - Submit answers before time expires

- **Proctoring Compliance**
  - Fullscreen enforcement (if enabled)
  - Tab-switch detection and logging
  - Violation warnings

- **Results & Scorecards**
  - View detailed exam results
  - Download scorecard as PDF
  - Review correct answers and explanations
  - Track performance history

- **Profile Management**
  - View personal information
  - Change password
  - Update profile details

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.11.0
- **State Management**: React Context API
- **HTTP Client**: Axios 1.13.2
- **UI Framework**: Bootstrap 5.3.8
- **Icons**: React Icons 5.5.0
- **Charts**: Recharts 3.7.0
- **PDF Generation**: jsPDF 4.0.0 with jspdf-autotable 5.0.7
- **Notifications**: React Toastify 11.0.5

### Backend - Spring Boot Service
- **Framework**: Spring Boot 3.5.9
- **Language**: Java 21
- **Security**: Spring Security with JWT (jjwt 0.13.0)
- **ORM**: Spring Data JPA with Hibernate
- **Database**: MySQL 8.0 (mysql-connector-j)
- **Validation**: Spring Boot Starter Validation
- **Email**: Spring Boot Starter Mail
- **API Documentation**: SpringDoc OpenAPI 2.8.14
- **Utilities**: Lombok, ModelMapper 3.2.6
- **AOP**: AspectJ Weaver

### Backend - Admin Service
- **Framework**: ASP.NET Core 8.0
- **Language**: C# (.NET 8)
- **ORM**: Entity Framework Core 8.0
- **Database**: MySQL (Pomelo.EntityFrameworkCore.MySql 8.0)
- **Authentication**: JWT Bearer (Microsoft.AspNetCore.Authentication.JwtBearer 8.0)
- **API Documentation**: Swashbuckle.AspNetCore 6.6.2

### Database
- **RDBMS**: MySQL 8.0
- **Databases**: 
  - `student_instructor_service_db` (Main backend)
  - `admin_service_db` (Admin service)

### DevOps & Deployment
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (for frontend in production)

---

## 📦 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**: v18+ and npm
- **Java**: JDK 21
- **Maven**: 3.8+
- **.NET SDK**: 8.0
- **MySQL**: 8.0+
- **Docker & Docker Compose**: (Optional, for containerized deployment)
- **Git**: For version control

---

## 🚀 Installation & Setup

### Option 1: Local Development Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd Online-Examination-Portal
```

#### 2. Database Setup

Create two MySQL databases (using root user):

```sql
CREATE DATABASE student_instructor_service_db;
CREATE DATABASE admin_service_db;
```

#### 3. Backend Setup - Spring Boot

```bash
cd oep_spring_backend

# Configure application.properties (if needed)
# Update database credentials, JWT secret, mail settings

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The Spring Boot service will start on `http://localhost:8080/oep`

#### 4. Admin Service Setup - .NET

```bash
cd AdminServiceDotNET

# Restore dependencies
dotnet restore

# Update database connection string in appsettings.json if needed

# Run migrations
dotnet ef database update

# Run the application
dotnet run
```

The Admin Service will start on `http://localhost:7097`

#### 5. Frontend Setup - React

```bash
cd frontend-Application

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
# VITE_API_BASE_URL=http://localhost:8080/oep
# VITE_ADMIN_API_BASE_URL=http://localhost:7097

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### Option 2: Docker Deployment

#### 1. Using Docker Compose

```bash
# From the project root directory
cd "Project Archive"

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

This will start:
- MySQL databases (ports 3306 and 3307)
- Spring Boot backend (port 8080)
- .NET Admin Service (port 7097)
- React Frontend (port 5173)

---

## ⚙️ Configuration

### Environment Variables

#### Spring Boot Backend (`application.properties`)

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/student_instructor_service_db
spring.datasource.username=kd2-harsh-92448
spring.datasource.password=manager

# JWT Configuration
jwt.secret=617b7c292a0698a897e6ff73324285be2ca049857c8802e26a4cce2214d899c4
jwt.expiration.time=72000000

# Email Configuration (for password reset)
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}

# Frontend URL (for password reset links)
frontend.reset.url=http://localhost:5173/auth/reset-password

# Admin Service URL
admin.service.url=http://localhost:7097
```

#### Admin Service (.NET) (`appsettings.json`)

```json
{
  "ConnectionStrings": {
    "AdminDb": "server=localhost;port=3307;database=admin_service_db;user=kd2-harsh-92448;password=manager"
  },
  "Jwt": {
    "Secret": "617b7c292a0698a897e6ff73324285be2ca049857c8802e26a4cce2214d899c4"
  },
  "SpringBackendUrl": "http://localhost:8080/oep",
  "FrontendUrl": "http://localhost:5173"
}
```

#### Frontend (`.env`)

```env
VITE_API_BASE_URL=http://localhost:8080/oep
VITE_ADMIN_API_BASE_URL=http://localhost:7097
```

---

## 📚 API Documentation

### Accessing API Documentation

- **Spring Boot Swagger UI**: `http://localhost:8080/oep/swagger-ui.html`
- **Admin Service Swagger UI**: `http://localhost:7097/swagger/index.html`

### Authentication

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Key API Endpoints

#### Authentication
- `POST /auth/signin` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

#### Admin Operations
- `GET /users` - List all users
- `POST /users` - Create new user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
- `GET /batches` - List batches
- `POST /batches` - Create batch
- `GET /logs` - View audit logs
- `GET /analytics` - System analytics

#### Instructor Operations
- `GET /instructor/courses` - Get assigned courses
- `POST /questions` - Create question
- `POST /questions/import` - Bulk import questions
- `POST /exams` - Create exam
- `GET /exams/{id}/live-stats` - Live exam monitoring
- `GET /results` - View results

#### Student Operations
- `GET /courses/available` - Browse courses
- `POST /courses/{id}/enrollments` - Enroll in course
- `GET /exams/available` - View available exams
- `POST /exams/{id}/submissions` - Start exam
- `PUT /exams/{id}/submissions` - Submit answers
- `GET /results/{id}` - View result

---

## 🗄️ Database Schema

### Main Database (student_instructor_service_db)

**Core Entities:**
- `users` - User accounts (Admin, Instructor, Student)
- `courses` - Course catalog
- `syllabus` - Course syllabus modules
- `enrollments` - Student-course relationships
- `questions` - Question bank
- `exams` - Exam definitions
- `exam_questions` - Exam-question mappings
- `exam_results` - Student exam attempts
- `student_answers` - Individual answer submissions
- `exam_violations` - Proctoring violation logs
- `randomization_rules` - Question randomization settings
- `audit_logs` - System audit trail

### Admin Database (admin_service_db)

**Core Entities:**
- `batches` - Student batch definitions
- `announcements` - System announcements
- `system_settings` - Global configuration
- `audit_logs` - Admin service audit trail

---

## 🚢 Deployment

### Production Deployment Checklist

1. **Environment Configuration**
   - Update database credentials
   - Set strong JWT secret keys
   - Configure email service credentials
   - Set production frontend URL

2. **Security Hardening**
   - Enable HTTPS
   - Configure CORS properly
   - Set secure cookie flags
   - Implement rate limiting

3. **Database**
   - Run migrations
   - Set up database backups
   - Configure connection pooling

4. **Monitoring**
   - Set up application logging
   - Configure health check endpoints
   - Implement error tracking

5. **Build & Deploy**

```bash
# Frontend production build
cd frontend-Application
npm run build

# Spring Boot production build
cd oep_spring_backend
mvn clean package -DskipTests

# .NET production build
cd AdminServiceDotNET
dotnet publish -c Release
```

### Deployment Platforms

The application can be deployed on:
- **AWS**: EC2, RDS, S3, CloudFront
- **Azure**: App Service, Azure Database for MySQL
- **Heroku**: Web dynos with ClearDB MySQL
- **Vercel/Netlify**: Frontend deployment
- **Render**: Full-stack deployment
- **Docker**: Any container orchestration platform (Kubernetes, ECS, etc.)

---

## 📁 Project Structure

```
Online-Examination-Portal/
├── frontend-Application/          # React frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── AdminPages/       # Admin dashboard
│   │   │   ├── InstructorPages/  # Instructor dashboard
│   │   │   ├── StudentPages/     # Student dashboard
│   │   │   ├── Common/           # Shared components
│   │   │   └── HomePage.jsx/     # Landing & auth pages
│   │   ├── services/             # API service layer
│   │   ├── contexts/             # React context providers
│   │   ├── utils/                # Utility functions
│   │   └── App.jsx               # Main app component
│   ├── public/                   # Static assets
│   ├── package.json              # Dependencies
│   └── vite.config.js            # Vite configuration
│
├── oep_spring_backend/           # Spring Boot backend
│   ├── src/main/java/com/oep/
│   │   ├── controller/           # REST controllers
│   │   ├── service/              # Business logic
│   │   ├── repository/           # Data access layer
│   │   ├── entities/             # JPA entities
│   │   ├── dtos/                 # Data transfer objects
│   │   ├── security/             # Security configuration
│   │   ├── exc_handler/          # Exception handlers
│   │   ├── aspect/               # AOP aspects
│   │   └── Application.java      # Main application
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml                   # Maven dependencies
│
├── AdminServiceDotNET/           # .NET Admin service
│   ├── Controllers/              # API controllers
│   ├── Service/                  # Business logic
│   ├── Data/                     # Repository layer
│   ├── Models/                   # Entity models
│   ├── Dtos/                     # Data transfer objects
│   ├── Middleware/               # Custom middleware
│   ├── Migrations/               # EF Core migrations
│   ├── Program.cs                # Application entry point
│   └── AdminServiceDotNET.csproj # Project file
│

```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- **Frontend**: Follow ESLint configuration
- **Backend (Java)**: Follow Java coding conventions
- **Backend (.NET)**: Follow C# coding conventions
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

---

## 📞 Support

For issues, questions, or contributions, please open an issue in the GitHub repository.

---

**Built with ❤️ for seamless online examination management**


# Deployment trigger