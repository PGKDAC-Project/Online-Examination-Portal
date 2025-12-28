import AppliedCourseCard from "./AppliedCourseCard";
import "./AppliedCourses.css"
import { useMemo } from "react";
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
  const hydratedCourses = useMemo(() => {
    return courses.map((c) => {
      const stored = localStorage.getItem(`syllabus:${c.courseCode}`);
      if (!stored) return c;
      try {
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) return c;
        return { ...c, syllabus: parsed };
      } catch {
        return c;
      }
    });
  }, []);

  return (
    <div className="course-grid">
      {hydratedCourses.map((course, index) => (
        <AppliedCourseCard key={index} course={course} />
      ))}
    </div>
  );
};

export default AppliedCourses;
