import { useState, useEffect } from "react";
import { FaBook, FaSearch, FaUserTie, FaClock, FaCheckCircle } from "react-icons/fa";
import { getAllCourses } from "../../services/admin/courseService";

const AvailableCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        // Fetch courses (mock)
        const load = async () => {
            try {
                const data = await getAllCourses();
                // Filter active courses
                setCourses(data.filter(c => c.status === "Active"));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = courses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container-fluid p-4">
            <h2 className="fw-bold text-gradient mb-4">Available Courses</h2>

            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div className="input-group" style={{ maxWidth: '400px' }}>
                    <span className="input-group-text"><FaSearch /></span>
                    <input
                        className="form-control"
                        placeholder="Search courses..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="row g-4">
                {loading ? <div className="col-12 text-center p-5">Loading courses...</div> : filtered.map(course => (
                    <div key={course.id} className="col-md-6 col-lg-4">
                        <div className="card-custom h-100 d-flex flex-column hover-card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="rounded-circle bg-primary bg-opacity-10 p-3">
                                        <FaBook className="text-primary fs-4" />
                                    </div>
                                    <span className="badge bg-light text-dark border">{course.courseCode}</span>
                                </div>
                                <h5 className="fw-bold mb-2">{course.title}</h5>
                                <p className="text-secondary small mb-3 flex-grow-1">{course.description}</p>

                                <div className="border-top pt-3 mt-auto">
                                    <div className="d-flex align-items-center mb-2 text-muted small">
                                        <FaUserTie className="me-2" />
                                        {course.instructorDetails?.name || "Verified Instructor"}
                                    </div>
                                    <div className="d-flex align-items-center mb-3 text-muted small">
                                        <FaClock className="me-2" />
                                        {(course.syllabus || []).reduce((acc, m) => acc + (Number(m.estimatedHrs) || 0), 0)} Hours Content
                                    </div>
                                    <button className="btn btn-primary-custom w-100">
                                        View Details & Enroll
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {!loading && filtered.length === 0 && (
                    <div className="col-12 text-center text-muted p-5">No courses found matching your search.</div>
                )}
            </div>
        </div>
    );
};

export default AvailableCourses;
