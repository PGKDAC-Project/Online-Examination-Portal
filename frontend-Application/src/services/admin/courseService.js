import { mockCourses } from "../../components/AdminPages/mockAdminData";
import { getJson, setJson } from "../../utils/storage";

const COURSES_KEY = "admin_courses";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredCourses = () => getJson(COURSES_KEY, mockCourses);
const setStoredCourses = (data) => setJson(COURSES_KEY, data);

export const getAllCourses = async () => {
    await delay(300);
    return getStoredCourses();
};

export const createCourse = async (courseData) => {
    await delay(500);
    const courses = getStoredCourses();

    // Strict Entity Check: courseCode, title, description, instructorDetails, syllabus
    if (!courseData.courseCode || !courseData.title || !courseData.description || !courseData.instructorDetails) {
        throw new Error("Missing required fields");
    }

    const newCourse = {
        id: Date.now(),
        ...courseData,
        createdOn: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        status: "Active" // Default status
    };

    courses.push(newCourse);
    setStoredCourses(courses);
    return newCourse;
};

export const updateCourse = async (id, courseData) => {
    await delay(500);
    const courses = getStoredCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Course not found");

    const updated = { ...courses[index], ...courseData, lastUpdated: new Date().toISOString() };
    courses[index] = updated;
    setStoredCourses(courses);
    return updated;
};

// Governance actions
export const updateCourseStatus = async (id, status) => {
    return updateCourse(id, { status });
};
