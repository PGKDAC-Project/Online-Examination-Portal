import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFileUpload, FaArrowLeft, FaFilePdf, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { uploadSyllabus } from "../../../services/instructor/instructorService";

function UploadSyllabus() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editor, setEditor] = useState({ modules: [], rawJson: "[]" });

    const applyRawJson = () => {
        try {
            const parsed = JSON.parse(editor.rawJson);
            if (!Array.isArray(parsed)) {
                toast.error("Syllabus JSON must be an array of modules.");
                return;
            }
            setEditor(prev => ({ ...prev, modules: parsed }));
            toast.success("Syllabus updated from JSON.");
        } catch {
            toast.error("Invalid JSON. Please fix and try again.");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const parsed = JSON.parse(editor.rawJson);
            await uploadSyllabus(courseId, { content: parsed });
            toast.success("Syllabus saved successfully to backend.");
            navigate('/instructor/courses');
        } catch (err) {
            toast.error("Failed to save syllabus: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const addModule = () => {
        const next = [...editor.modules, { moduleName: "", topics: [""] }];
        setEditor({ modules: next, rawJson: JSON.stringify(next, null, 2) });
    };

    const updateModuleName = (idx, value) => {
        const next = editor.modules.map((m, i) => (i === idx ? { ...m, moduleName: value } : m));
        setEditor({ modules: next, rawJson: JSON.stringify(next, null, 2) });
    };

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate('/instructor/courses')}>
                <FaArrowLeft /> Back
            </button>
            <div className="card shadow-sm">
                <div className="card-header bg-success text-white">
                    <h4 className="mb-0"><FaFileUpload className="me-2" /> Upload Syllabus - {courseId}</h4>
                </div>
                <div className="card-body">
                    <textarea
                        className="form-control mb-3"
                        rows={10}
                        value={editor.rawJson}
                        onChange={(e) => setEditor(prev => ({ ...prev, rawJson: e.target.value }))}
                    />
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-outline-primary" onClick={applyRawJson}>Apply JSON</button>
                        <button className="btn btn-success" onClick={handleSave} disabled={loading}>
                            {loading ? "Saving..." : "Save to Backend"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UploadSyllabus;
