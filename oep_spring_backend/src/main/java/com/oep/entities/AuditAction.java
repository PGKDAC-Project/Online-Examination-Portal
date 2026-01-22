package com.oep.entities;

public enum AuditAction {

    // Authentication 
    LOGIN,
    LOGOUT,
    LOGIN_FAILED,
    PASSWORD_RESET_REQUEST,
    PASSWORD_CHANGED,
    ACCOUNT_ACTIVATED,

    // User Mgmt
    USER_CREATED,
    USER_UPDATED,
    USER_DELETED,
    ROLE_ASSIGNED,
    BATCH_ASSIGNED,

    // Course & Syllabus 
    COURSE_CREATED,
    COURSE_UPDATED,
    COURSE_DELETED,
    SYLLABUS_UPDATED,

    // Enrollment 
    STUDENT_ENROLLED,
    STUDENT_UNENROLLED,

    // Questions 
    QUESTION_CREATED,
    QUESTION_UPDATED,
    QUESTION_DELETED,

    // Exams 
    EXAM_CREATED,
    EXAM_UPDATED,
    EXAM_DELETED,
    EXAM_PUBLISHED,
    QUESTION_ADDED_TO_EXAM,
    QUESTION_REMOVED_FROM_EXAM,

    // Exam Attempts 
    EXAM_STARTED,
    ANSWER_SAVED,
    EXAM_SUBMITTED,

    // Evaluation 
    RESULT_EVALUATED,
    RESULT_PUBLISHED,

    // Admin / System 
    LOG_VIEWED,
    LOG_EXPORTED,
    SYSTEM_CONFIG_UPDATED
}

