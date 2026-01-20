import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserCreate = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "Student",
    status: "Active",
    password: ""
  });

  const update = (key) => (e) => {
    setUser((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!user.name.trim() || !user.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    if (user.password && user.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    toast.success("User created (demo).");
    navigate("/admin/users");
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
              <input className="form-control" value={user.name} onChange={update("name")} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={user.email} onChange={update("email")} />
            </div>

            <div className="col-md-4">
              <label className="form-label">Role</label>
              <select className="form-select" value={user.role} onChange={update("role")}>
                <option>Student</option>
                <option>Instructor</option>
                <option>Admin</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select className="form-select" value={user.status} onChange={update("status")}>
                <option>Active</option>
                <option>Disabled</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Temporary Password</label>
              <input
                type="password"
                className="form-control"
                value={user.password}
                onChange={update("password")}
                placeholder="Optional"
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
