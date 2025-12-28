import { FaUsers, FaClipboardCheck, FaExclamationTriangle } from "react-icons/fa";

const AdminOverview = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>System overview and monitoring</p>

      <div className="grid">
        <div className="card">
          <FaUsers />
          <h3>Total Users</h3>
          <p>1,248</p>
        </div>

        <div className="card">
          <FaClipboardCheck />
          <h3>Active Exams</h3>
          <p>12</p>
        </div>

        <div className="card danger">
          <FaExclamationTriangle />
          <h3>Violations Today</h3>
          <p>19</p>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
