import AppliedCourseCard from "./AppliedCourseCard";
import "./AppliedCourses.css";
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axiosClient from '../../../services/axios/axiosClient';
import { getCurrentUser } from '../../../services/auth/authService';

const AppliedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const user = getCurrentUser();
        if (!user?.id) {
          toast.error('User not logged in');
          return;
        }
        const data = await axiosClient.get(`/student/courses/${user.id}`);
        setCourses(data || []);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        toast.error('Failed to load enrolled courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div>Loading courses...</div>;

  return (
    <div className="course-grid">
      {courses.length === 0 ? (
        <div className="alert alert-info">No enrolled courses found</div>
      ) : (
        courses.map((course) => (
          <AppliedCourseCard key={course.id || course.courseId} course={course} />
        ))
      )}
    </div>
  );
};

export default AppliedCourses;
