import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFileCsv, FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ImportQuestions = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);

    const handleUpload = () => {
        if (!file) {
            toast.error("Please select a file.");
            return;
        }
        toast.success("Questions imported successfully!");
        navigate('/instructor/question-bank');
    };

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate('/instructor/question-bank')}>
                <FaArrowLeft /> Back
            </button>

            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Import Questions</h4>
                </div>
                <div className="card-body text-center p-5">
                    <FaFileCsv size={60} className="text-success mb-3" />
                    <h5>Upload CSV / Excel File</h5>
                    <p className="text-muted">Format: Question, Option A, Option B, Option C, Option D, Correct Answer, Difficulty</p>
                    
                    <input type="file" className="form-control w-50 mx-auto mb-3" onChange={(e) => setFile(e.target.files[0])} />
                    
                    <button className="btn btn-primary px-4" onClick={handleUpload}>
                        <FaUpload className="me-2" /> Import
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportQuestions;
