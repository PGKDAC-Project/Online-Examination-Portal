import React, { useRef, useState } from 'react'; // Import useRef and useState
// ... other imports

const StudentProfileView = () => {
    // Assume you have profile data
    const [student, setStudent] = useState({ // Use useState to manage student data
        fullName: "Ankit Singh",
        username: "Ankit_24___",
        studentId: "S123456789",
        email: "Arkkseies967@gmail.com",
        profilePic: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Profile" // Initial profile picture
        // ... other editable fields
    });

    // Create a ref for the hidden file input
    const fileInputRef = useRef(null);

    // Function to handle the "Change Photo" button click
    const handleChangePhotoButtonClick = () => {
        // Programmatically click the hidden file input
        fileInputRef.current.click();
    };

    // Function to handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            // Here you would typically upload the file to your backend
            // For now, let's just display it locally as a preview

            const reader = new FileReader();
            reader.onloadend = () => {
                setStudent(prevStudent => ({
                    ...prevStudent,
                    profilePic: reader.result // Set the profilePic to the new image data URL
                }));
            };
            reader.readAsDataURL(file); // Read the file as a data URL
            // In a real application, you would send this 'file' object
            // to a server using a FormData object and an API call (e.g., Axios, fetch).
            // Example: uploadProfilePhoto(file);
        }
    };

    return (
        <div className="container-fluid py-4">
            <h1 className="mb-4">My Profile</h1>

            {/* Top Profile Section */}
            <div className="card shadow-sm mb-4 profile-header text-center py-4">
                <img
                    src={student.profilePic} // Use the profilePic from state
                    alt="Profile"
                    className="rounded-circle mx-auto mb-3"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }} // Added objectFit
                />
                <h2 className="mb-1">{student.fullName}</h2>
                <p className="text-muted">{student.username}</p>

                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }} // Keep it hidden
                    accept="image/*" // Restrict to image files
                    onChange={handleFileChange}
                />

                <button
                    className="btn btn-primary btn-sm mt-2"
                    onClick={handleChangePhotoButtonClick} // Trigger the file input click
                >
                    <i className="fas fa-camera me-2"></i> Change Photo
                </button>
            </div>

            {/* System-Verified Fields */}
            <div className="card shadow-sm mb-4">
                <div className="card-header profile-section-title">
                    <i className="fas fa-lock me-2"></i> System-Verified Fields
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <p className="mb-0 profile-field-label">
                                <i className="fas fa-user me-2"></i> Full Name:
                            </p>
                            <p className="lead profile-field-value">{student.fullName}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <p className="mb-0 profile-field-label">
                                <i className="fas fa-id-card me-2"></i> Student ID / Roll Number:
                            </p>
                            <p className="lead profile-field-value">{student.studentId}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <p className="mb-0 profile-field-label">
                                <i className="fas fa-envelope me-2"></i> Email ID (System):
                            </p>
                            <p className="lead profile-field-value">{student.email}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <p className="mb-0 profile-field-label">
                                <i className="fas fa-user-circle me-2"></i> Username:
                            </p>
                            <p className="lead profile-field-value">{student.username}</p>
                        </div>
                    </div>
                
                </div>
            </div>

            {/* Editable Fields (Example - you'd likely have a form here) */}
            <div className="card shadow-sm mb-4">
                <div className="card-header profile-section-title">
                    <i className="fas fa-edit me-2"></i> Editable Fields
                </div>
                <div className="card-body">
                    {/* Example editable field */}
                    <div className="mb-3">
                        <label htmlFor="phoneNumber" className="form-label profile-field-label">Phone Number:</label>
                        <input type="tel" className="form-control" id="phoneNumber" defaultValue="123-456-7890" />
                    </div>
                    <button className="btn btn-success">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default StudentProfileView;
