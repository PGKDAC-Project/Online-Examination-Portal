import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllBatches } from "../../services/admin/batchService";
import { createUser } from "../../services/admin/adminService";

const UserCreate = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "Student",
    status: "Active",
    batchId: "", // Added batchId
    password: ""
  });

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const data = await getAllBatches();
      // Filter active batches (endDate >= today)
      const today = new Date().toISOString().split('T')[0];
      const active = Array.isArray(data) ? data.filter(b => b.endDate >= today) : [];
      setBatches(active);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load batches");
    }
  };

  const update = (key) => (e) => {
    setUser((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!user.name.trim() || !user.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    if (user.password && user.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      await createUser(user);
      // toast.success("User created successfully."); // Removed per requirement
      navigate("/admin/users");
    } catch (err) {
      toast.error("Failed to create user");
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Create User</h1>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/admin/users")}>
          Back
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={submit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input className="form-control" value={user.name} onChange={update("name")} required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={user.email} onChange={update("email")} required />
            </div>

            <div className="col-md-4">
              <label className="form-label">Role</label>
              <select className="form-select" value={user.role} onChange={update("role")}>
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select className="form-select" value={user.status} onChange={update("status")}>
                <option value="Active">Active</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>

            {/* Batch Dropdown - Visible only for Students */}
            {user.role === 'Student' && (
              <div className="col-md-4">
                <label className="form-label">Batch</label>
                <select className="form-select" value={user.batchId} onChange={update("batchId")}>
                  <option value="">Select Batch</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.batchName}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="col-md-4">
              <label className="form-label">Temporary Password</label>
              <input
                type="password"
                className="form-control"
                value={user.password}
                onChange={update("password")}
                placeholder="Optional / Default"
              />
            </div>

            <div className="col-12 d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/admin/users")}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserCreate;
