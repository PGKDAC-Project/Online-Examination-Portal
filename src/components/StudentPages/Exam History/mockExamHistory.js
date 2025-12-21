// src/mock/mockExamHistory.js

export const mockExamHistory = [
  {
    examId: "EXAM001",
    examName: "DSA Midterm Exam",
    courseCode: "CS101",
    attemptedOn: "2025-02-10",
    score: 72,
    totalMarks: 100,
    result: "Pass",
    status: "Completed",
    resultEnabled: true
  },
  {
    examId: "EXAM002",
    examName: "Operating Systems Test",
    courseCode: "CS102",
    attemptedOn: "2025-02-05",
    score: 38,
    totalMarks: 80,
    result: "Fail",
    status: "Auto-Submitted",
    resultEnabled: true
  },
  {
    examId: "EXAM003",
    examName: "Database Management Quiz",
    courseCode: "CS103",
    attemptedOn: "2025-01-28",
    score: null,
    totalMarks: 50,
    result: "Pending",
    status: "Completed",
    resultEnabled: false
  }
];
