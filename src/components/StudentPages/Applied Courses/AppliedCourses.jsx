import AppliedCourseCard from "./AppliedCourseCard";
import "./AppliedCourses.css"
const courses = [
  {
    courseName: "Data Structures",
    courseCode: "CS101",
    instructor: "Mr. Devendra Dhande",
    status: "Active",
    syllabus: [
      {
        moduleName: "Arrays & Strings",
        topics: ["1D Arrays", "2D Arrays", "Strings"]
      },
      {
        moduleName: "Linked Lists",
        topics: ["Singly", "Doubly", "Circular"]
      }
    ]
  }
];

const AppliedCourses = () => {
  return (
    <div className="course-grid">
      {courses.map((course, index) => (
        <AppliedCourseCard key={index} course={course} />
      ))}
    </div>
  );
};

export default AppliedCourses;
