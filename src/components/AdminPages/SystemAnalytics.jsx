import { useState } from 'react';

const SystemAnalytics = () => {
  const [stats] = useState([
    { label: 'Total Users', value: 1250, change: '+5%' },
    { label: 'Active Exams', value: 45, change: '+12%' },
    { label: 'Completed Exams', value: 3400, change: '+8%' },
    { label: 'Avg. Score', value: '76%', change: '-2%' },
  ]);

  return (
    <div className="admin-page-container">
      <h2>System Analytics</h2>
      <p>Overview of system performance and usage statistics.</p>

      <div className="row mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-3">
            <div className="card text-center p-3 shadow-sm">
              <h5 className="text-muted">{stat.label}</h5>
              <h3>{stat.value}</h3>
              <small className={stat.change.startsWith('+') ? 'text-success' : 'text-danger'}>
                {stat.change} from last month
              </small>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h4>User Growth</h4>
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px', background: '#f8f9fa' }}>
              <p className="text-muted">[Chart Placeholder: User Registrations over Time]</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h4>Exam Performance</h4>
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px', background: '#f8f9fa' }}>
              <p className="text-muted">[Chart Placeholder: Pass/Fail Ratio]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;
