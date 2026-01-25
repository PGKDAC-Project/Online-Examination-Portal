# 📋 Exhaustive Backend API Specification

This document lists **every single** REST endpoint required by the frontend application to function at 100% capacity.

---

## 🔐 1. Authentication & Security
| Endpoint | Method | DTO / Payload Fields | Description |
|----------|--------|----------------------|-------------|
| `/auth/signin` | `POST` | `{email, password}` | User login |
| `/auth/forgot-password` | `POST` | `{email}` | Request password reset link |
| `/auth/reset-password/validate` | `GET` | N/A | Validate reset token (`?token=...`) |
| `/auth/reset-password` | `POST` | `{token, newPassword}` | Set new password with token |

---

## 📢 2. Common Features (Cross-Role)
| Endpoint | Method | DTO / Payload Fields | Description |
|----------|--------|----------------------|-------------|
| `/announcements` | `GET` | N/A | Fetch all system announcements |
| `/announcements` | `POST` | `{title, description, targetRole, targetBatch, expiryDate}` | Create announcement |
| `/announcements/{id}` | `DELETE`| N/A | Remove announcement |
| `/settings` | `GET` | N/A | Fetch system-wide proctoring/maintenance rules |
| `/settings` | `PUT` | `{tabSwitchDetection, fullscreenEnforcement, maintenanceMode}` | Update global settings |

---

## 🏢 3. Admin Management
### User Control
| Endpoint | Method | DTO / Payload Fields | Description |
|----------|--------|----------------------|-------------|
| `/users` | `GET` | N/A | List all users |
| `/users/{id}` | `GET` | N/A | Fetch detailed user profile |
| `/users` | `POST`| `{name, email, role, status, batchId, password}` | Create new user |
| `/users/{id}` | `PUT` | `{name, email, role, status, batchId, password}` | Update user details |
| `/users/{id}` | `DELETE`| N/A | Permanently remove user |

### Course & Batch Management
| Endpoint | Method | DTO / Payload Fields | Description |
|----------|--------|----------------------|-------------|
| `/courses` | `GET` | N/A | List all available library courses |
| `/courses/{id}` | `GET` | N/A | Course syllabus and metadata |
| `/courses` | `POST`| `{courseCode, title, description, instructorDetails: {id}, syllabus: [{moduleNo, moduleTitle, moduleDescription, estimatedHrs}]}` | Define new course |
| `/courses/{id}` | `PUT` | `{courseCode, title, description, ...}` | Edit course |
| `/courses/{id}/status` | `PATCH`| `{status}` (Active, Suspended) | Manually change course status |
| `/courses/{id}` | `DELETE`| N/A | Delete course |
| `/batches` | `GET` | N/A | List student batches |
| `/batches/{id}` | `GET` | N/A | Batch-specific enrollment data |
| `/batches` | `POST`| `{batchName, startDate, endDate}` | Define new student batch |
| `/batches/{id}` | `PUT` | `{batchName, startDate, endDate}` | Update batch dates |
| `/batches/{id}` | `DELETE`| N/A | Remove batch |

### Monitoring & Oversight
| Endpoint | Method | DTO / Payload Fields | Description |
|----------|--------|----------------------|-------------|
| `/logs` | `GET` | N/A | Global system audit trails |
| `/analytics` | `GET` | N/A | Dashboard metrics |
| `/exams` | `GET` | N/A | Comprehensive schedule list |
| `/exams/{id}` | `DELETE`| N/A | Admin override to cancel exam |
| `/results` | `GET` | N/A | Master list of all student attempts |

---

## 🎓 4. Instructor Features
### Exam & Question Bank
| Endpoint | Method | DTO / Payload Fields | Description |
|----------|--------|----------------------|-------------|
| `/instructor/courses` | `GET` | N/A | Courses assigned to instructor |
| `/courses/{id}/enrollments`| `GET` | N/A | List of students in course |
| `/courses/{id}/syllabus` | `POST` | `[{moduleNo, moduleTitle, moduleDescription, estimatedHrs}]` | Update syllabus |
| `/courses/{id}/outcomes` | `POST` | `["Outcome 1", "Outcome 2"]` | Define learning outcomes |
| `/questions` | `GET` | N/A | Filter questions (`?courseId=...`) |
| `/questions` | `POST` | `{courseCode, type, text, options: [], correctAnswer: Any, pairs: [{left, right}], difficulty, marks}` | Manual question entry |
| `/questions/{id}` | `PUT` | (Same as POST) | Edit question |
| `/questions/{id}` | `DELETE`| N/A | Remove from bank |
| `/questions/{id}/tags` | `PATCH`| `{tags: ["tag1", "tag2"]}` | Update tags |
| `/questions/import` | `POST` | `FormData` (multipart with `file`) | **Bulk Import questions** |
| `/courses/{id}/randomization`| `GET` | N/A | Get shuffle rules |
| `/courses/{id}/randomization`| `POST` | `{total, easyCount, mediumCount, hardCount}` | Save shuffle rules |

### Proctored Supervision
| Endpoint | Method | DTO / Payload Fields | Description |
|----------|--------|----------------------|-------------|
| `/exams/{id}/live-stats` | `GET` | N/A | Active exam metrics |
| `/exams/{id}/live-students`| `GET` | N/A | Individual student status |

---

## 👨‍🎓 5. Student Features
### Enrollment & Navigation
| Endpoint | Method | DTO / Payload Fields | Description |
|----------|--------|----------------------|-------------|
| `/profile` | `GET` | N/A | Student profile summary |
| `/dashboard` | `GET` | N/A | Student performance stats |
| `/courses/available` | `GET` | N/A | Courses student can join |
| `/courses/{id}/enrollments`| `POST` | N/A (Empty Body) | Self-enroll in course |

### Examination Flow
| Endpoint | Method | DTO / Payload Fields | Description |
|----------|--------|----------------------|-------------|
| `/exams/available` | `GET` | N/A | Upcoming eligible exams |
| `/student/exams` | `GET` | N/A | Individual history |
| `/exams/{id}/submissions` | `POST` | `{password}` | **Start Exam** |
| `/exams/{id}/submissions` | `PUT` | `{answers: { "q1_id": "value", ... }}` | **Submit Answers** |
| `/exams/{id}/violations` | `POST` | `{type, detail, timestamp}` | Log proctoring violation |
| `/results/{id}` | `GET` | N/A | Detailed scorecard |
