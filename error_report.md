# Error Report: Announcement Service JWT Claims Issue

## Problem
The AnnouncementService was failing to create announcements with validation errors "Creator role is required, Creator email is required" even though JWT authentication was working.

## Root Cause
The JWT token claims were not being extracted correctly due to incorrect claim type mapping:

### JWT Token Claims Structure
```
Available claims:
  http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier: nitishkumardbg17@gmail.com
  iat: 1770193069
  exp: 1770265069
  user_id: 1
  user_role: ROLE_ADMIN
  http://schemas.microsoft.com/ws/2008/06/identity/claims/role: ROLE_ADMIN
```

### Issue
- **Email Claim**: Located in `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier` (ClaimTypes.NameIdentifier)
- **Role Claim**: Located in `user_role` 
- **Original Code**: Was looking for email in `sub`, `email`, `unique_name` claims (which didn't exist)

## Solution
Updated the claim extraction logic in `AnnouncementServiceImpl.cs`:

```csharp
// Fixed email extraction to use ClaimTypes.NameIdentifier first
var userEmail = user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
               user.FindFirst("sub")?.Value ?? 
               user.FindFirst("email")?.Value ?? 
               user.FindFirst("unique_name")?.Value ?? 
               user.Identity?.Name;

var userRoleStr = user.FindFirst("user_role")?.Value ?? 
                 user.FindFirst("role")?.Value ?? 
                 user.FindFirst(ClaimTypes.Role)?.Value;
```

## Key Learning
- JWT claim types can vary between implementations
- Always debug and inspect actual claim structure before assuming standard claim names
- Use `ClaimTypes.NameIdentifier` for user email in .NET applications
- The `user_role` claim was working correctly from the start

## Status
✅ **RESOLVED** - Announcements can now be created successfully with proper JWT claim extraction.


---

## Error #[Date: 2026-02-08] - CourseController Compilation Error

**Error Type:** Compilation Error  
**Location:** `CourseController.java` - `updateCourseOutcomes()` method  
**Severity:** High

### Error Message:
```
java.lang.Error: Unresolved compilation problem: 
The method updateCourse(Long, CourseRequestDto) in the type CourseService is not applicable for the arguments (Long, CourseResponseDto)
```

### Root Cause:
The `updateCourseOutcomes()` method was trying to call `courseService.updateCourse()` with incorrect parameter types:
- Expected: `updateCourse(Long, CourseRequestDto)`
- Provided: `updateCourse(Long, CourseResponseDto)`

The code was attempting to convert a `Courses` entity to DTO using `mapToDto()` which returns `CourseResponseDto`, but the service method expects `CourseRequestDto`.

### Solution:
1. Changed the implementation to directly save the course entity using `courseRepository.save()`
2. Added `CourseRepository` as a dependency in the controller
3. Removed the unnecessary DTO conversion

**Fixed Code:**
```java
@PostMapping("/courses/{courseId}/outcomes")
public ResponseEntity<?> updateCourseOutcomes(@PathVariable Long courseId, @RequestBody Map<String, List<String>> payload) {
    List<String> outcomes = payload.get("outcomes");
    Courses course = courseService.getCourseById(courseId);
    course.setOutcomes(outcomes != null ? outcomes : List.of());
    courseRepository.save(course);  // Direct save instead of calling updateCourse
    return ResponseEntity.ok(new ApiResponse("success", "Outcomes updated successfully"));
}
```

**Status:** ✅ Resolved


---

## Enhancement #[Date: 2026-02-08] - Question Management & Matching Type Shuffle

**Type:** Feature Enhancement  
**Location:** ExamQuestions.jsx, ExamController.java  
**Severity:** Medium

### Issue Description:
1. No option to add questions to exams during exam creation/editing
2. Question types in frontend didn't match backend entity (QuestionType enum)
3. Multiple choice questions only allowed single answer selection
4. Matching type questions had no UI for creating pairs
5. No backend logic to shuffle matching pairs for students

### Changes Implemented:

#### Frontend (ExamQuestions.jsx):
1. **Added "Manage Questions" button** in Edit Exam page header
2. **Created inline question creation modal** with:
   - Question text input
   - Type dropdown: SINGLE, MULTIPLE, TRUE_FALSE, MATCHING
   - Marks and difficulty level selectors
   - Dynamic UI based on question type

3. **Question Type Specific UI:**
   - **SINGLE**: 4 options + single correct answer text field
   - **MULTIPLE**: 4 options + checkboxes for multiple correct answers
   - **TRUE_FALSE**: Dropdown with True/False options
   - **MATCHING**: Pairs of left/right items with "Add Pair" button

4. **UI Improvements:**
   - Fixed spacing between "Create New Question" button and badge using `gap-3`
   - Better alignment with `d-flex align-items-center`

#### Backend (ExamController.java):
1. **Added new endpoint** `/student/exams/{examId}/questions`:
   - Returns questions with shuffled matching pairs
   - Left items shuffled independently
   - Right items shuffled independently
   - Uses `Collections.shuffle()` for randomization

2. **Instructor endpoint** `/instructor/exams/{examId}/questions`:
   - Returns original unshuffled questions
   - Allows instructors to see correct pairs

### Implementation Details:

**Matching Pairs Shuffle Logic:**
```java
if (question.getType() == QuestionType.MATCHING) {
    Map<String, String> originalPairs = question.getMatchingPairs();
    List<String> leftItems = new ArrayList<>(originalPairs.keySet());
    List<String> rightItems = new ArrayList<>(originalPairs.values());
    
    Collections.shuffle(leftItems);
    Collections.shuffle(rightItems);
    
    questionData.put("leftItems", leftItems);
    questionData.put("rightItems", rightItems);
}
```

**Frontend State Management:**
```javascript
const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    type: 'SINGLE',
    marksAllotted: 1,
    level: 'EASY',
    options: ['', '', '', ''],
    correctAnswer: '',
    correctAnswers: [],
    matchingPairs: [{ left: '', right: '' }, { left: '', right: '' }]
});
```

### Benefits:
1. ✅ Seamless question creation within exam management
2. ✅ Questions automatically added to question bank
3. ✅ Support for all question types (SINGLE, MULTIPLE, TRUE_FALSE, MATCHING)
4. ✅ Anti-cheating: Matching pairs shuffled per student
5. ✅ Better UX with inline modal instead of navigation
6. ✅ Proper spacing and alignment in UI

**Status:** ✅ Completed & Tested
