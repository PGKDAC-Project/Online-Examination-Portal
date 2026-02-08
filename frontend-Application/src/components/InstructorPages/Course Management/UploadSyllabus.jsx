import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBook, FaArrowLeft, FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { uploadSyllabus } from "../../../services/instructor/instructorService";
import axiosClient from '../../../services/axios/axiosClient';

function UploadSyllabus() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingModules, setFetchingModules] = useState(true);

    useEffect(() => {
        fetchExistingModules();
    }, [courseId]);

    const fetchExistingModules = async () => {
        try {
            setFetchingModules(true);
            const response = await axiosClient.get(`/courses/${courseId}/syllabus`);
            if (response && response.content) {
                // Transform backend format to frontend format
                const transformedModules = Array.isArray(response.content) 
                    ? response.content.map(item => ({
                        moduleName: item.moduleTitle || item.moduleName || '',
                        topics: item.moduleDescription ? [item.moduleDescription] : (item.topics || [''])
                    }))
                    : [];
                setModules(transformedModules);
            } else {
                setModules([]);
            }
        } catch (err) {
            console.log('No existing syllabus found, starting fresh');
            setModules([]);
        } finally {
            setFetchingModules(false);
        }
    };

    const addModule = () => {
        setModules([...modules, { moduleName: '', topics: [''] }]);
    };

    const removeModule = (moduleIndex) => {
        setModules(modules.filter((_, idx) => idx !== moduleIndex));
    };

    const updateModuleName = (moduleIndex, value) => {
        const updated = modules.map((mod, idx) => 
            idx === moduleIndex ? { ...mod, moduleName: value } : mod
        );
        setModules(updated);
    };

    const addTopic = (moduleIndex) => {
        const updated = modules.map((mod, idx) => 
            idx === moduleIndex ? { ...mod, topics: [...mod.topics, ''] } : mod
        );
        setModules(updated);
    };

    const removeTopic = (moduleIndex, topicIndex) => {
        const updated = modules.map((mod, idx) => 
            idx === moduleIndex ? { ...mod, topics: mod.topics.filter((_, tIdx) => tIdx !== topicIndex) } : mod
        );
        setModules(updated);
    };

    const updateTopic = (moduleIndex, topicIndex, value) => {
        const updated = modules.map((mod, idx) => 
            idx === moduleIndex ? {
                ...mod,
                topics: mod.topics.map((topic, tIdx) => tIdx === topicIndex ? value : topic)
            } : mod
        );
        setModules(updated);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        // Validation
        if (modules.length === 0) {
            toast.error('Please add at least one module');
            return;
        }
        
        for (let i = 0; i < modules.length; i++) {
            if (!modules[i].moduleName.trim()) {
                toast.error(`Module ${i + 1} name is required`);
                return;
            }
            if (modules[i].topics.length === 0 || !modules[i].topics.some(t => t.trim())) {
                toast.error(`Module ${i + 1} must have at least one topic`);
                return;
            }
        }

        setLoading(true);
        try {
            await uploadSyllabus(courseId, { content: modules });
            toast.success('Syllabus saved successfully');
            navigate('/instructor/courses');
        } catch (err) {
            toast.error('Failed to save syllabus: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    if (fetchingModules) {
        return (
            <div className="container mt-4">
                <button className="btn btn-secondary mb-3" onClick={() => navigate('/instructor/courses')}>
                    <FaArrowLeft /> Back to Courses
                </button>
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h4 className="mb-0"><FaBook className="me-2" /> Manage Syllabus - Course {courseId}</h4>
                    </div>
                    <div className="card-body text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading syllabus...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate('/instructor/courses')}>
                <FaArrowLeft /> Back to Courses
            </button>
            
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0"><FaBook className="me-2" /> Manage Syllabus - Course {courseId}</h4>
                    <button className="btn btn-light btn-sm" onClick={addModule}>
                        <FaPlus className="me-1" /> Add Module
                    </button>
                </div>
                
                <div className="card-body">
                    {modules.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FaBook size={48} className="mb-3 opacity-50" />
                            <p>No modules added yet. Click "Add Module" to start.</p>
                        </div>
                    ) : (
                        <div className="accordion" id="modulesAccordion">
                            {modules.map((module, moduleIndex) => (
                                <div className="accordion-item mb-3" key={moduleIndex}>
                                    <h2 className="accordion-header">
                                        <div className="d-flex align-items-center">
                                            <button
                                                className="accordion-button"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#module${moduleIndex}`}
                                            >
                                                Module {moduleIndex + 1}: {module.moduleName || 'Untitled'}
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger ms-2 me-2"
                                                onClick={() => removeModule(moduleIndex)}
                                                title="Remove Module"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </h2>
                                    <div
                                        id={`module${moduleIndex}`}
                                        className="accordion-collapse collapse show"
                                    >
                                        <div className="accordion-body">
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Module Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={module.moduleName}
                                                    onChange={(e) => updateModuleName(moduleIndex, e.target.value)}
                                                    placeholder="Enter module name"
                                                />
                                            </div>
                                            
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <label className="form-label fw-bold mb-0">Topics</label>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => addTopic(moduleIndex)}
                                                    >
                                                        <FaPlus className="me-1" /> Add Topic
                                                    </button>
                                                </div>
                                                
                                                {module.topics.map((topic, topicIndex) => (
                                                    <div className="input-group mb-2" key={topicIndex}>
                                                        <span className="input-group-text">{topicIndex + 1}</span>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={topic}
                                                            onChange={(e) => updateTopic(moduleIndex, topicIndex, e.target.value)}
                                                            placeholder="Enter topic name"
                                                        />
                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => removeTopic(moduleIndex, topicIndex)}
                                                            disabled={module.topics.length === 1}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/instructor/courses')}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={handleSave}
                            disabled={loading || modules.length === 0}
                        >
                            <FaSave className="me-1" />
                            {loading ? 'Saving...' : 'Save Syllabus'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UploadSyllabus;
