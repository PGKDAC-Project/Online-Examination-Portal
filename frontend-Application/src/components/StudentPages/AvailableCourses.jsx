import { useState, useEffect } from "react";
import { FaBook, FaSearch, FaUserTie, FaClock, FaChevronDown, FaChevronUp, FaListUl, FaBullseye } from "react-icons/fa";
import { getAllCourses } from "../../services/admin/courseService";
import { toast } from "react-toastify";

const AvailableCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [expandedCourse, setExpandedCourse] = useState(null); // stores courseId

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getAllCourses();
            setCourses(Array.isArray(data) ? data.filter(c => c.status === "Active") : []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedCourse(expandedCourse === id ? null : id);
    };

    const filtered = courses.filter(c =>
        (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.description || "").toLowerCase().includes(search.toLowerCase())
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
                        <div className="card-custom h-100 d-flex flex-column hover-card shadow-sm border-0 bg-white">
                            <div className="card-body p-4">
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

                                    <button
                                        className="btn btn-outline-secondary btn-sm w-100 mb-2 d-flex justify-content-between align-items-center"
                                        onClick={() => toggleExpand(course.id)}
                                    >
                                        <span>View Syllabus & Outcomes</span>
                                        {expandedCourse === course.id ? <FaChevronUp /> : <FaChevronDown />}
                                    </button>

                                    {expandedCourse === course.id && (
                                        <div className="mb-3 bg-light p-3 rounded small animate__animated animate__fadeIn">
                                            <h6 className="fw-bold text-primary mb-2"><FaListUl className="me-2" /> Syllabus</h6>
                                            <ul className="mb-3 ps-3">
                                                {(course.syllabus && course.syllabus.length > 0) ? (
                                                    course.syllabus.map((item, idx) => (
                                                        <li key={idx} className="mb-1">{item.moduleTitle || item}</li>
                                                    ))
                                                ) : <li>No syllabus details available.</li>}
                                            </ul>

                                            <h6 className="fw-bold text-success mb-2"><FaBullseye className="me-2" /> Learning Outcomes</h6>
                                            <ul className="ps-3 mb-0">
                                                {(course.outcomes && course.outcomes.length > 0) ? (
                                                    course.outcomes.map((out, idx) => (
                                                        <li key={idx} className="mb-1">{out}</li>
                                                    ))
                                                ) : <li>No outcomes listed.</li>}
                                            </ul>
                                        </div>
                                    )}

                                    <button className="btn btn-primary-custom w-100">
                                        Enroll Now
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
