namespace AdminServiceDotNET
{
    public enum ServiceName
    {
        AUTH_SERVICE,        // Login, logout, activation, password reset
        USER_SERVICE,        // User creation, role assignment, batch assignment
        COURSE_SERVICE,      // Course and syllabus management
        EXAM_SERVICE,        // Exam creation, question mapping, scheduling
        QUESTION_SERVICE,    // Question CRUD
        RESULT_SERVICE,      // Evaluation, publish results
        ENROLLMENT_SERVICE,  // Student enrollments
        ADMIN_SERVICE,       // Logs, dashboards, system configs
        BATCH_SERVICE,
        ANNOUNCEMENT_SERVICE,
        SYSTEM_SERVICE
    }
}