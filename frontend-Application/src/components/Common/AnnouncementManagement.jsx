import { useState, useEffect, useMemo } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { getAllAnnouncements, createAnnouncement, deleteAnnouncement } from "../../services/common/announcementService";
import { getAllBatches } from "../../services/admin/batchService";
import { getCurrentUser } from "../../services/auth/authService";
import { toast } from "react-toastify";

const AnnouncementManagement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        targetRole: "All",
        targetBatch: "",
        expiryDate: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [data, batchList] = await Promise.all([
                getAllAnnouncements(),
                getAllBatches()
            ]);
            setAnnouncements(Array.isArray(data) ? data : []);
            setBatches(Array.isArray(batchList) ? batchList : []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load announcements");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this announcement?")) {
            try {
                await deleteAnnouncement(id);
                toast.success("Announcement deleted");
                loadData();
            } catch (err) {
                toast.error("Failed to delete announcement");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare the data, converting empty expiryDate to null
            const submitData = {
                ...formData,
                expiryDate: formData.expiryDate || null
            };
            await createAnnouncement(submitData);
            toast.success("Announcement posted successfully");
            setShowModal(false);
            setFormData({ title: "", description: "", targetRole: "All", targetBatch: "", expiryDate: "" });
            loadData();
        } catch (err) {
            console.error('Error creating announcement:', err);
            toast.error(err.message || "Failed to create announcement");
        }
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-gradient">Announcements</h2>
                <button className="btn btn-primary-custom" onClick={() => setShowModal(true)}>
                    <FaPlus className="me-2" /> Post Announcement
                </button>
            </div>

            <div className="row g-4">
                {loading ? <div className="col-12 text-center p-5">Loading...</div> : announcements.map(anno => (
                    <div key={anno.id} className="col-md-6 col-lg-4">
                        <div className="card-custom h-100 shadow-sm border-0 bg-white">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <h5 className="fw-bold mb-0 text-dark text-truncate" title={anno.title}>{anno.title}</h5>
                                    <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(anno.id)}>
                                        <FaTrash />
                                    </button>
                                </div>

                                <div className="mb-3">
                                    <span className="badge bg-light text-secondary me-2 border">{anno.createdAt ? new Date(anno.createdAt).toLocaleDateString() : ""}</span>
                                    <span className="badge bg-primary bg-opacity-10 text-primary">Target: {anno.targetRole} {anno.targetBatch && `(${anno.targetBatch})`}</span>
                                    {anno.expiryDate && (
                                        <div className="mt-1 small text-muted">Expires: {new Date(anno.expiryDate).toLocaleDateString()}</div>
                                    )}
                                </div>
                                <p className="text-secondary mb-0" style={{ lineHeight: '1.6' }}>{anno.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {!loading && announcements.length === 0 && (
                    <div className="col-12 text-center text-muted p-5">No announcements yet.</div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content card-custom border-0">
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="modal-title fw-bold">Post Announcement</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Title</label>
                                        <input className="form-control form-control-custom" required
                                            value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Description</label>
                                        <textarea className="form-control form-control-custom" rows="3" required
                                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                                    </div>
                                    <div className="row g-2 mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Target Audience</label>
                                            <select className="form-select form-control-custom" value={formData.targetRole}
                                                onChange={e => setFormData({ ...formData, targetRole: e.target.value })}>
                                                <option value="All">All Users</option>
                                                <option value="Student">Students Only</option>
                                                <option value="Instructor">Instructors Only</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Expiry Date</label>
                                            <input type="date" className="form-control form-control-custom"
                                                value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
                                        </div>
                                    </div>
                                    {(formData.targetRole === "Student" || formData.targetRole === "All") && (
                                        <div className="mb-4">
                                            <label className="form-label fw-medium">Specific Batch (Optional)</label>
                                            <select className="form-select form-control-custom" value={formData.targetBatch}
                                                onChange={e => setFormData({ ...formData, targetBatch: e.target.value })}>
                                                <option value="">All Batches</option>
                                                {batches.map(b => (
                                                    <option key={b.id} value={b.batchName}>{b.batchName}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-end gap-2">
                                        <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary-custom">Post</button>
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

export default AnnouncementManagement;
