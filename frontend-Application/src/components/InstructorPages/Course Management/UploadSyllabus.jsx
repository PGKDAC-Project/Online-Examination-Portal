import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFileUpload, FaArrowLeft, FaFilePdf, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UploadSyllabus = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const storageKey = useMemo(() => `syllabus:${courseId}`, [courseId]);

    const [editor, setEditor] = useState(() => {
        const stored = localStorage.getItem(storageKey);
        if (!stored) return { modules: [], rawJson: "[]" };
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                return { modules: parsed, rawJson: JSON.stringify(parsed, null, 2) };
            }
            return { modules: [], rawJson: stored };
        } catch {
            return { modules: [], rawJson: stored };
        }
    });

    const modules = editor.modules;
    const rawJson = editor.rawJson;

    const setModules = (nextModules) => {
        setEditor((prev) => ({ ...prev, modules: nextModules }));
    };

    const setRawJson = (nextRaw) => {
        setEditor((prev) => ({ ...prev, rawJson: nextRaw }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const applyRawJson = () => {
        try {
            const parsed = JSON.parse(rawJson);
            if (!Array.isArray(parsed)) {
                toast.error("Syllabus JSON must be an array of modules.");
                return;
            }
            setModules(parsed);
            toast.success("Syllabus updated from JSON.");
        } catch {
            toast.error("Invalid JSON. Please fix and try again.");
        }
    };

    const readFileToEditor = (selectedFile) => {
        const reader = new FileReader();
        reader.onload = () => {
            const text = String(reader.result ?? "");
            setRawJson(text);
            try {
                const parsed = JSON.parse(text);
                if (Array.isArray(parsed)) {
                    setModules(parsed);
                    toast.success("Loaded syllabus from file.");
                } else {
                    toast.warning("File loaded. JSON is not an array of modules.");
                }
            } catch {
                toast.warning("File loaded. Could not parse JSON; edit it below.");
            }
        };
        reader.onerror = () => toast.error("Could not read the file.");
        reader.readAsText(selectedFile);
    };

    const handleUpload = async () => {
        if (file) {
            readFileToEditor(file);
            toast.info("Reading file content...");
            return;
        }
        applyRawJson();
    };

    const saveSyllabus = () => {
        try {
            const parsed = JSON.parse(rawJson);
            if (!Array.isArray(parsed)) {
                toast.error("Syllabus JSON must be an array of modules.");
                return;
            }
            localStorage.setItem(storageKey, JSON.stringify(parsed));
            toast.success(`Syllabus for ${courseId} saved.`);
            navigate('/instructor/courses');
        } catch {
            toast.error("Invalid JSON. Please fix and try again.");
        }
    };

    const addModule = () => {
        const next = [...modules, { moduleName: "", topics: [""] }];
        setModules(next);
        setRawJson(JSON.stringify(next, null, 2));
    };

    const updateModuleName = (idx, value) => {
        const next = modules.map((m, i) => (i === idx ? { ...m, moduleName: value } : m));
        setModules(next);
        setRawJson(JSON.stringify(next, null, 2));
    };

    const addTopic = (moduleIdx) => {
        const next = modules.map((m, i) =>
            i === moduleIdx ? { ...m, topics: [...(m.topics ?? []), ""] } : m
        );
        setModules(next);
        setRawJson(JSON.stringify(next, null, 2));
    };

    const updateTopic = (moduleIdx, topicIdx, value) => {
        const next = modules.map((m, i) => {
            if (i !== moduleIdx) return m;
            const topics = Array.isArray(m.topics) ? [...m.topics] : [];
            topics[topicIdx] = value;
            return { ...m, topics };
        });
        setModules(next);
        setRawJson(JSON.stringify(next, null, 2));
    };

    const removeModule = (idx) => {
        const next = modules.filter((_, i) => i !== idx);
        setModules(next);
        setRawJson(JSON.stringify(next, null, 2));
    };

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate('/instructor/courses')}>
                <FaArrowLeft /> Back to Courses
            </button>

            <div className="card shadow-sm">
                <div className="card-header bg-success text-white">
                    <h4 className="mb-0"><FaFileUpload className="me-2" /> Upload Syllabus - {courseId}</h4>
                </div>
                <div className="card-body">
                    <div className="mb-4 text-center p-5 border border-dashed rounded bg-light">
                        <FaFilePdf size={50} className="text-danger mb-3" />
                        <h5>Select Syllabus File</h5>
                        <p className="text-muted">Supported formats: .json (preferred), .txt</p>
                        
                        <input 
                            type="file" 
                            className="form-control w-50 mx-auto" 
                            accept=".json,.txt"
                            onChange={(e) => {
                                handleFileChange(e);
                                const selected = e.target.files?.[0];
                                if (selected) readFileToEditor(selected);
                            }}
                        />
                    </div>

                    {file && (
                        <div className="alert alert-info d-flex justify-content-between align-items-center">
                            <span>Selected: <strong>{file.name}</strong></span>
                            <button className="btn btn-sm btn-danger" onClick={() => setFile(null)}><FaTrash /></button>
                        </div>
                    )}

                    <div className="card mb-4">
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                            <span>Structured Syllabus Editor</span>
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-sm btn-outline-light" onClick={addModule}>
                                    Add Module
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-light" onClick={applyRawJson}>
                                    Apply JSON
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            {modules.length === 0 && (
                                <div className="text-muted">No modules yet. Add one or paste JSON below.</div>
                            )}
                            {modules.map((m, moduleIdx) => (
                                <div key={moduleIdx} className="border rounded p-3 mb-3">
                                    <div className="d-flex gap-2 align-items-center mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={`Module ${moduleIdx + 1} name`}
                                            value={m.moduleName ?? ""}
                                            onChange={(e) => updateModuleName(moduleIdx, e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => removeModule(moduleIdx)}
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    {(Array.isArray(m.topics) ? m.topics : []).map((t, topicIdx) => (
                                        <div key={topicIdx} className="mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={`Topic ${topicIdx + 1}`}
                                                value={t ?? ""}
                                                onChange={(e) => updateTopic(moduleIdx, topicIdx, e.target.value)}
                                            />
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => addTopic(moduleIdx)}
                                    >
                                        Add Topic
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Syllabus JSON</label>
                        <textarea
                            className="form-control"
                            rows={10}
                            value={rawJson}
                            onChange={(e) => setRawJson(e.target.value)}
                        />
                    </div>

                    <div className="d-flex justify-content-between">
                        <button className="btn btn-outline-secondary" onClick={handleUpload}>
                            Load From File / Apply JSON
                        </button>
                        <button className="btn btn-success px-4" onClick={saveSyllabus}>
                            Save Syllabus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadSyllabus;
