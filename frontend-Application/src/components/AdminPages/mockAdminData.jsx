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

export const mockBatches = [
  { id: 1, batchName: "PG-DAC-FEB-2025", startDate: "2025-02-15", endDate: "2025-08-15", createdOn: "2025-01-20T10:00:00" },
  { id: 2, batchName: "PG-DBDA-FEB-2025", startDate: "2025-02-20", endDate: "2025-08-20", createdOn: "2025-01-21T11:00:00" },
  { id: 3, batchName: "PG-DESD-FEB-2025", startDate: "2025-02-10", endDate: "2025-08-10", createdOn: "2025-01-22T09:30:00" }
];

export const mockCourses = [
  {
    id: 1,
    courseCode: "REACT-101",
    title: "Introduction to React",
    description: "Learn React basics",
    instructorDetails: { id: 2, name: "Dr. Sharma", email: "dr.sharma@example.com" },
    syllabus: [
      { moduleNo: 1, moduleTitle: "Intro", moduleDescription: "What is React?", estimatedHrs: 2 },
      { moduleNo: 2, moduleTitle: "Components", moduleDescription: "Functional components", estimatedHrs: 4 }
    ],
    status: "Active"
  },
  {
    id: 2,
    courseCode: "NODE-201",
    title: "Advanced Node.js",
    description: "Server side JS",
    instructorDetails: { id: 2, name: "Dr. Sharma", email: "dr.sharma@example.com" },
    syllabus: [],
    status: "Active"
  }
];
