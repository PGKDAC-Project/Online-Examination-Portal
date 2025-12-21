import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./AppliedCourses.css"

const AppliedCourseCard = ({ course }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="course-card">
      {/* Header */}
      <div className="course-header">
        <div>
          <h5>{course.courseName}</h5>
          <p className="text-muted">
            {course.courseCode} · Instructor: {course.instructor}
          </p>
        </div>

        <span className={`status ${course.status.toLowerCase()}`}>
          {course.status}
        </span>
      </div>

      {/* Syllabus Toggle */}
      <button
        className="syllabus-btn"
        onClick={() => setOpen(!open)}
      >
        Syllabus {open ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {/* Syllabus Dropdown */}
      {open && (
        <div className="syllabus-content">
          {course.syllabus.map((module, index) => (
            <div key={index} className="module">
              <strong>Module {index + 1}: {module.moduleName}</strong>
              <ul>
                {module.topics.map((topic, i) => (
                  <li key={i}>{topic}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedCourseCard;
