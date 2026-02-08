import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./AppliedCourses.css"

const AppliedCourseCard = ({ course }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="course-card">
      <div className="course-header">
        <div>
          <h5>{course.title || course.courseName}</h5>
          <p className="text-muted">
            {course.courseCode} · Instructor: {course.instructors && course.instructors.length > 0 ? course.instructors.map(i => i.name).join(', ') : course.instructor || 'N/A'}
          </p>
        </div>

        <span className={`status ${(course.status || 'active').toLowerCase()}`}>
          {course.status || 'Active'}
        </span>
      </div>

      <button
        className="syllabus-btn"
        onClick={() => setOpen(!open)}
      >
        Syllabus {open ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {open && (
        <div className="syllabus-content">
          {course.syllabus && course.syllabus.length > 0 ? (
            course.syllabus.map((module, index) => (
              <div key={index} className="module">
                <strong>Module {module.moduleNo || index + 1}: {module.moduleTitle || module.moduleName}</strong>
                {module.moduleDescription && <p>{module.moduleDescription}</p>}
                {module.topics && (
                  <ul>
                    {module.topics.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted">No syllabus available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AppliedCourseCard;
