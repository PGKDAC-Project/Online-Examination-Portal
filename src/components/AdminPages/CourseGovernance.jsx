import { useState } from 'react';

const CourseGovernance = () => {
  const [courses, setCourses] = useState([
    { id: 1, title: 'Introduction to React', instructor: 'John Doe', status: 'Pending', students: 120 },
    { id: 2, title: 'Advanced Node.js', instructor: 'Jane Smith', status: 'Active', students: 85 },
    { id: 3, title: 'Python for Data Science', instructor: 'Alice Johnson', status: 'Active', students: 200 },
    { id: 4, title: 'Machine Learning Basics', instructor: 'Bob Brown', status: 'Rejected', students: 0 },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, status: newStatus } : course
    ));
  };

  return (
    <div className="admin-page-container">
      <h2>Course Governance</h2>
      <p>Manage and review courses submitted by instructors.</p>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Instructor</th>
              <th>Students</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.title}</td>
                <td>{course.instructor}</td>
                <td>{course.students}</td>
                <td>
                  <span className={`badge ${
                    course.status === 'Active' ? 'bg-success' : 
                    course.status === 'Pending' ? 'bg-warning' : 'bg-danger'
                  }`}>
                    {course.status}
                  </span>
                </td>
                <td>
                  {course.status === 'Pending' && (
                    <>
                      <button 
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleStatusChange(course.id, 'Active')}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleStatusChange(course.id, 'Rejected')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {course.status === 'Active' && (
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleStatusChange(course.id, 'Suspended')}
                    >
                      Suspend
                    </button>
                  )}
                  {course.status === 'Suspended' && (
                     <button 
                     className="btn btn-sm btn-success"
                     onClick={() => handleStatusChange(course.id, 'Active')}
                   >
                     Re-Activate
                   </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseGovernance;
