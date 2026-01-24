import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { getAllBatches, createBatch, updateBatch, deleteBatch } from "../../services/admin/batchService";

const BatchManagement = () => {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        batchName: "",
        startDate: "",
        endDate: ""
    });
    const [error, setError] = useState("");

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const data = await getAllBatches();
            setBatches(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setFormData({ id: null, batchName: "", startDate: "", endDate: "" });
        setError("");
        setShowModal(true);
    };

    const handleEdit = (batch) => {
        setFormData({
            id: batch.id,
            batchName: batch.batchName,
            startDate: batch.startDate,
            endDate: batch.endDate
        });
        setError("");
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this batch?")) {
            try {
                await deleteBatch(id);
                fetchBatches();
            } catch (err) {
                alert("Failed to delete batch");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (formData.id) {
                await updateBatch(formData.id, formData);
            } else {
                await createBatch(formData);
            }
            setShowModal(false);
            fetchBatches();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-gradient">Batch Management</h2>
                <button className="btn btn-primary-custom" onClick={handleCreate}>
                    <FaPlus className="me-2" /> Create New Batch
                </button>
            </div>

            <div className="card-custom p-4">
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Batch Name</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center p-4">Loading batches...</td></tr>
                            ) : batches.length === 0 ? (
                                <tr><td colSpan="4" className="text-center p-4">No batches found.</td></tr>
                            ) : (
                                batches.map(batch => (
                                    <tr key={batch.id}>
                                        <td className="fw-medium">{batch.batchName}</td>
                                        <td>{batch.startDate}</td>
                                        <td>{batch.endDate}</td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleEdit(batch)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(batch.id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content card-custom border-0">
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    {formData.id ? "Edit Batch" : "Create New Batch"}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Batch Name</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-custom"
                                            value={formData.batchName}
                                            onChange={e => setFormData({ ...formData, batchName: e.target.value })}
                                            required
                                            placeholder="e.g. PG-DAC-FEB-2025"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Start Date</label>
                                        <input
                                            type="date"
                                            className="form-control form-control-custom"
                                            value={formData.startDate}
                                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">End Date</label>
                                        <input
                                            type="date"
                                            className="form-control form-control-custom"
                                            value={formData.endDate}
                                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="d-flex justify-content-end gap-2 mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-light"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary-custom">
                                            {formData.id ? "Update Batch" : "Create Batch"}
                                        </button>
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

export default BatchManagement;
