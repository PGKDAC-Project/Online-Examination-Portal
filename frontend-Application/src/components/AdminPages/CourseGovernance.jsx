import { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaBook, FaCheck, FaTimes, FaBan, FaFileCsv, FaFilePdf, FaSearch } from 'react-icons/fa';
import { getAllCourses, createCourse, updateCourseStatus } from '../../services/admin/courseService';
import { getAllInstructors } from '../../services/admin/userService';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';
import { toast } from 'react-toastify';

const CourseGovernance = () => {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [instructorFilter, setInstructorFilter] = useState("All");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    courseCode: "",
    title: "",
    description: "",
    instructorIds: [],
    status: "Active",
    syllabus: []
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [courseData, instructorData] = await Promise.all([
        getAllCourses(),
        getAllInstructors()
      ]);
      setCourses(Array.isArray(courseData) ? courseData : []);
      // Filter to show only users with instructor role
      const filteredInstructors = Array.isArray(instructorData) 
        ? instructorData.filter(user => user.role && user.role.toLowerCase() === 'instructor')
        : [];
      setInstructors(filteredInstructors);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesSearch = (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.courseCode || "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      const matchesInstructor = instructorFilter === "All" || String(c.instructorDetails?.id) === String(instructorFilter);
      return matchesSearch && matchesStatus && matchesInstructor;
    });
  }, [courses, search, statusFilter, instructorFilter]);

  const handleExportCSV = () => {
    const data = filteredCourses.map(c => ({
      "Code": c.courseCode,
      "Title": c.title,
      "Instructors": c.instructors && c.instructors.length > 0 
        ? c.instructors.map(inst => inst.name || inst.userName).join(", ")
        : "No instructors assigned",
      "Modules": (c.syllabus || []).length,
      "Status": c.status
    }));
    exportToCSV(data, "course_list");
  };

  const handleExportPDF = () => {
    const columns = ["Code", "Title", "Instructors", "Modules", "Status"];
    const data = filteredCourses.map(c => ({
      "Code": c.courseCode,
      "Title": c.title,
      "Instructors": c.instructors && c.instructors.length > 0 
        ? c.instructors.map(inst => inst.name || inst.userName).join(", ")
        : "No instructors assigned",
      "Modules": (c.syllabus || []).length,
      "Status": c.status
    }));
    exportToPDF(data, columns, "Course List", "course_list");
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateCourseStatus(id, newStatus);
      fetchData(); // Refresh
      toast.success(`Course status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleCreateOpen = () => {
    setFormData({
      courseCode: "",
      title: "",
      description: "",
      instructorIds: [],
      status: "Active",
      syllabus: [{ moduleNo: 1, moduleTitle: "", moduleDescription: "", estimatedHrs: 0 }] // Start with one module
    });
    setError("");
    setShowModal(true);
  };

  const handleSyllabusChange = (index, field, value) => {
    const updatedSyllabus = [...formData.syllabus];
    updatedSyllabus[index][field] = value;
    setFormData({ ...formData, syllabus: updatedSyllabus });
  };

  const addModule = () => {
    setFormData({
      ...formData,
      syllabus: [
        ...formData.syllabus,
        { moduleNo: formData.syllabus.length + 1, moduleTitle: "", moduleDescription: "", estimatedHrs: 0 }
      ]
    });
  };

  const removeModule = (index) => {
    const updated = formData.syllabus.filter((_, i) => i !== index);
    // Re-index module numbers
    const reindexed = updated.map((m, i) => ({ ...m, moduleNo: i + 1 }));
    setFormData({ ...formData, syllabus: reindexed });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Prepare payload matching Entity
    const payload = {
      courseCode: formData.courseCode,
      title: formData.title,
      description: formData.description,
      instructorIds: formData.instructorIds.length > 0 
        ? formData.instructorIds.map(id => Number(id)).filter(id => id > 0)
        : [],
      status: formData.status,
      syllabus: formData.syllabus.map(s => ({
        ...s,
        estimatedHrs: Number(s.estimatedHrs),
        moduleNo: Number(s.moduleNo)
      }))
    };

    try {
      await createCourse(payload);
      setShowModal(false);
      fetchData();
      toast.success("Course created successfully");
    } catch (err) {
      setError(err.message || "Failed to create course");
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-gradient">Course Governance</h2>
          <p className="text-muted mb-0">Manage courses, syllabus, and instructor assignments.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success btn-sm d-flex align-items-center" onClick={handleExportCSV}>
            <FaFileCsv className="me-2" /> Export CSV
          </button>
          <button className="btn btn-danger btn-sm d-flex align-items-center" onClick={handleExportPDF}>
            <FaFilePdf className="me-2" /> Export PDF
          </button>
          <button className="btn btn-primary-custom" onClick={handleCreateOpen}>
            <FaPlus className="me-2" /> Create New Course
          </button>
        </div>
      </div>

      <div className="card-custom p-3 mb-4">
        <div className="row g-2">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text"><FaSearch /></span>
              <input
                className="form-control"
                placeholder="Search by Title or Code..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={instructorFilter} onChange={e => setInstructorFilter(e.target.value)}>
              <option value="All">All Instructors</option>
              {instructors.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card-custom p-4 shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Instructors</th>
                <th>Modules</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center p-4">Loading...</td></tr>
              ) : filteredCourses.length === 0 ? (
                <tr><td colSpan="6" className="text-center p-4">No courses found matching filter.</td></tr>
              ) : (
                filteredCourses.map(course => (
                  <tr key={course.id}>
                    <td className="fw-medium">{course.courseCode}</td>
                    <td>
                      <div className="fw-bold">{course.title}</div>
                      <div className="small text-muted text-truncate" style={{ maxWidth: '200px' }}>{course.description}</div>
                    </td>
                    <td>
                      {course.instructors && course.instructors.length > 0 
                        ? course.instructors.map(inst => inst.name || inst.userName).join(", ")
                        : "No instructors assigned"
                      }
                    </td>
                    <td>
                      <span className="badge bg-secondary rounded-pill">
                        {(course.syllabus || []).length} Modules
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${course.status === 'Active' ? 'bg-success' :
                        course.status === 'Pending' ? 'bg-warning' : 'bg-danger'
                        }`}>
                        {course.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        {course.status !== 'Active' && (
                          <button className="btn btn-sm btn-outline-success" title="Approve/Activate" onClick={() => handleStatusChange(course.id, 'Active')}>
                            <FaCheck />
                          </button>
                        )}
                        {course.status === 'Active' && (
                          <button className="btn btn-sm btn-outline-warning" title="Suspend" onClick={() => handleStatusChange(course.id, 'Suspended')}>
                            <FaBan />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content card-custom border-0">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title fw-bold">Create New Course</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Course Code</label>
                      <input
                        type="text"
                        className="form-control form-control-custom"
                        placeholder="e.g. REACT-101"
                        value={formData.courseCode}
                        onChange={e => setFormData({ ...formData, courseCode: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label fw-medium">Course Title</label>
                      <input
                        type="text"
                        className="form-control form-control-custom"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Instructors</label>
                      <div className="position-relative">
                        <select
                          className="form-select form-control-custom"
                          multiple
                          value={formData.instructorIds}
                          onChange={e => {
                            const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                            setFormData({ ...formData, instructorIds: selectedIds });
                          }}
                          style={{ minHeight: '120px' }}
                        >
                          {instructors.map(inst => (
                            <option key={inst.id} value={inst.id}>
                              {inst.name} ({inst.email})
                            </option>
                          ))}
                        </select>
                        <small className="text-muted d-block mt-1">
                          Hold Ctrl/Cmd and click to select multiple instructors
                        </small>
                        {formData.instructorIds.length > 0 && (
                          <div className="mt-2">
                            <small className="text-success fw-medium">
                              Selected: {formData.instructorIds.length} instructor(s)
                            </small>
                            <div className="d-flex flex-wrap gap-1 mt-1">
                              {formData.instructorIds.map(id => {
                                const instructor = instructors.find(i => String(i.id) === String(id));
                                return instructor ? (
                                  <span key={id} className="badge bg-primary">
                                    {instructor.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Status</label>
                      <select
                        className="form-select form-control-custom"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                        required
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-medium">Description</label>
                    <textarea
                      className="form-control form-control-custom"
                      rows="3"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label fw-bold mb-0">Syllabus (Modules)</label>
                      <button type="button" className="btn btn-sm btn-outline-primary" onClick={addModule}>
                        <FaPlus /> Add Module
                      </button>
                    </div>
                    <div className="bg-light p-3 rounded-3 border" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {formData.syllabus.map((module, idx) => (
                        <div key={idx} className="card p-3 mb-2 shadow-sm border-0">
                          <div className="d-flex justify-content-between mb-2">
                            <small className="text-muted fw-bold">Module #{module.moduleNo}</small>
                            {formData.syllabus.length > 1 && (
                              <button type="button" className="btn btn-sm text-danger p-0" onClick={() => removeModule(idx)}>
                                <FaTimes />
                              </button>
                            )}
                          </div>
                          <div className="row g-2">
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Module Title"
                                value={module.moduleTitle}
                                onChange={e => handleSyllabusChange(idx, 'moduleTitle', e.target.value)}
                                required
                              />
                            </div>
                            <div className="col-md-4">
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                placeholder="Est. Hours"
                                value={module.estimatedHrs}
                                onChange={e => handleSyllabusChange(idx, 'estimatedHrs', e.target.value)}
                                required
                              />
                            </div>
                            <div className="col-12">
                              <textarea
                                className="form-control form-control-sm"
                                placeholder="Description..."
                                rows="2"
                                value={module.moduleDescription}
                                onChange={e => handleSyllabusChange(idx, 'moduleDescription', e.target.value)}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary-custom">Create Course</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseGovernance;
