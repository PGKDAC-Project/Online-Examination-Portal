// src/components/InstructorPages/LiveExamMonitoring.jsx
import React from 'react';
import {
    FaUsers,
    FaUserCheck,
    FaExclamationTriangle,
    FaWindowClose,
    FaExternalLinkAlt,
    FaClock,
    FaCheckCircle
} from 'react-icons/fa';

function LiveExamMonitoring() {

    // Placeholder live exam data (real-time via WebSocket later)
    const examStats = {
        attempted: 120,
        active: 96,
        autoSubmitted: 8
    };

    const violations = {
        tabSwitches: 34,
        fullscreenExits: 12
    };

    const students = [
        {
            id: "S101",
            name: "Ankit Singh",
            status: "In Progress",
            tabSwitches: 2,
            fullscreenExits: 0
        },
        {
            id: "S102",
            name: "Riya Sharma",
            status: "Submitted",
            tabSwitches: 0,
            fullscreenExits: 0
        },
        {
            id: "S103",
            name: "Kunal Verma",
            status: "Auto-submitted",
            tabSwitches: 4,
            fullscreenExits: 2
        }
    ];

    const statusBadge = (status) => {
        switch (status) {
            case "In Progress":
                return "badge bg-primary";
            case "Submitted":
                return "badge bg-success";
            case "Auto-submitted":
                return "badge bg-danger";
            default:
                return "badge bg-secondary";
        }
    };

    return (
        <div>
            <h2 className="mb-4">Live Exam Monitoring</h2>

            {/* Live Stats */}
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 text-center">
                        <div className="card-body">
                            <FaUsers size={28} className="text-primary mb-2" />
                            <h6>Total Attempted</h6>
                            <h3>{examStats.attempted}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 text-center">
                        <div className="card-body">
                            <FaUserCheck size={28} className="text-success mb-2" />
                            <h6>Active Students</h6>
                            <h3>{examStats.active}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 text-center">
                        <div className="card-body">
                            <FaExclamationTriangle size={28} className="text-danger mb-2" />
                            <h6>Auto-Submitted</h6>
                            <h3>{examStats.autoSubmitted}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Violation Summary */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-warning">
                    <strong>Violation Summary</strong>
                </div>
                <div className="card-body d-flex justify-content-between">
                    <span>
                        <FaExternalLinkAlt className="me-2 text-danger" />
                        Tab Switches: <strong>{violations.tabSwitches}</strong>
                    </span>
                    <span>
                        <FaWindowClose className="me-2 text-danger" />
                        Fullscreen Exits: <strong>{violations.fullscreenExits}</strong>
                    </span>
                </div>
            </div>

            {/* Student-wise Monitoring */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white">
                    <strong>Student-wise Status</strong>
                </div>

                <div className="card-body table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Tab Switches</th>
                                <th>Fullscreen Exits</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>
                                        <span className={statusBadge(student.status)}>
                                            {student.status === "In Progress" && <FaClock className="me-1" />}
                                            {student.status === "Submitted" && <FaCheckCircle className="me-1" />}
                                            {student.status === "Auto-submitted" && <FaExclamationTriangle className="me-1" />}
                                            {student.status}
                                        </span>
                                    </td>
                                    <td>{student.tabSwitches}</td>
                                    <td>{student.fullscreenExits}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Security note */}
            <div className="alert alert-info mt-4">
                <strong>Security Note:</strong> Violations and auto-submissions are logged in real time.
                Final disciplinary decisions must be taken based on backend audit logs, not UI counters.
            </div>
        </div>
    );
}

export default LiveExamMonitoring;
