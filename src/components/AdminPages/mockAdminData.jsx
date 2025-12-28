export const mockUsers = [
  { id: 1, name: "Ankit Singh", role: "Student", status: "Active", lastLogin: "Today", email: "ankit.singh@example.com", password: "student123" },
  { id: 2, name: "Dr. Sharma", role: "Instructor", status: "Active", lastLogin: "Yesterday", email: "dr.sharma@example.com", password: "instructor123" },
  { id: 3, name: "Admin", role: "Admin", status: "Active", lastLogin: "Today", email: "admin@example.com", password: "admin123" }
];

export const mockLogs = [
  { id: 1, time: "2025-12-28 10:30", userId: 1, user: "Ankit Singh", role: "Student", action: "Login", status: "Success" },
  { id: 2, time: "2025-12-28 10:55", userId: 1, user: "Ankit Singh", role: "Student", action: "Profile Update", status: "Success" },
  { id: 3, time: "2025-12-28 11:00", userId: 1, user: "Ankit Singh", role: "Student", action: "Tab Switch", status: "Violation", examId: 101 },
  { id: 4, time: "2025-12-28 11:35", userId: 1, user: "Ankit Singh", role: "Student", action: "Logout", status: "Success" },
  { id: 5, time: "2025-12-28 09:10", userId: 2, user: "Dr. Sharma", role: "Instructor", action: "Login", status: "Success" },
  { id: 6, time: "2025-12-28 09:25", userId: 2, user: "Dr. Sharma", role: "Instructor", action: "Exam Created", status: "Success", examId: 102 },
  { id: 7, time: "2025-12-28 09:55", userId: 2, user: "Dr. Sharma", role: "Instructor", action: "Logout", status: "Success" },
  { id: 8, time: "2025-12-28 08:45", userId: 3, user: "Admin", role: "Admin", action: "Login", status: "Success" },
  { id: 9, time: "2025-12-28 09:05", userId: 3, user: "Admin", role: "Admin", action: "User Created", status: "Success" },
  { id: 10, time: "2025-12-28 09:30", userId: 3, user: "Admin", role: "Admin", action: "Logout", status: "Success" }
];

export const mockExams = [
  { id: 101, title: "React Basics Final", instructor: "Dr. Sharma", status: "Ongoing", scheduledTime: "10:00 AM - 12:00 PM", activeStudents: 45, malpracticeReports: 2 },
  { id: 102, title: "Java Advanced", instructor: "Prof. Gupta", status: "Scheduled", scheduledTime: "2:00 PM - 4:00 PM", activeStudents: 0, malpracticeReports: 0 },
  { id: 103, title: "Database Systems", instructor: "Dr. Rao", status: "Completed", scheduledTime: "Yesterday", activeStudents: 0, malpracticeReports: 5 },
];
