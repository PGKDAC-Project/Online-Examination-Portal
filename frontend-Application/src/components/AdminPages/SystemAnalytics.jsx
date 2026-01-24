import { useState, useEffect } from "react";
import { FaUserGraduate, FaChalkboardTeacher, FaUsers } from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { getAllBatches } from "../../services/admin/batchService";
import { getAllUsers } from "../../services/admin/userService";
import { mockExams } from "./mockAdminData"; // Assuming mockExams is exported there

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b'];

const SystemAnalytics = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    batches: [],
    userDistribution: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [batchesData, usersData] = await Promise.all([
        getAllBatches(),
        getAllUsers()
      ]);

      const students = usersData.filter(u => (u.role || "").toLowerCase() === "student");
      const instructors = usersData.filter(u => (u.role || "").toLowerCase() === "instructor");

      // Mock calculations for distribution
      const dist = [
        { name: 'Students', value: students.length },
        { name: 'Instructors', value: instructors.length },
        { name: 'Admins', value: usersData.length - students.length - instructors.length }
      ];

      setStats({
        totalStudents: students.length,
        totalInstructors: instructors.length,
        batches: batchesData,
        userDistribution: dist
      });
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-5 text-center">Loading Analytics...</div>;

  // Mock data for charts since we don't have full relational data in mocks
  const batchPerformance = stats.batches.map(b => ({
    name: b.batchName,
    avgScore: Math.floor(Math.random() * 30) + 70, // Random 70-100
    passRate: Math.floor(Math.random() * 20) + 80  // Random 80-100
  }));

  const examTrends = [
    { month: 'Jan', exams: 12 },
    { month: 'Feb', exams: 19 },
    { month: 'Mar', exams: 15 },
    { month: 'Apr', exams: 25 },
    { month: 'May', exams: 32 },
    { month: 'Jun', exams: 40 },
  ];

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold text-gradient mb-4">System Analytics</h2>

      {/* User Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card-custom p-4 d-flex align-items-center bg-white">
            <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-4">
              <FaUserGraduate className="text-primary fs-2" />
            </div>
            <div>
              <h3 className="fw-bold mb-0">{stats.totalStudents}</h3>
              <div className="text-muted">All Students</div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-custom p-4 d-flex align-items-center bg-white">
            <div className="rounded-circle bg-secondary bg-opacity-10 p-3 me-4">
              <FaChalkboardTeacher className="text-secondary fs-2" />
            </div>
            <div>
              <h3 className="fw-bold mb-0">{stats.totalInstructors}</h3>
              <div className="text-muted">All Instructors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-4">
        {/* Batch Performance Bar Chart */}
        <div className="col-lg-8">
          <div className="card-custom p-4 h-100">
            <h5 className="fw-bold mb-4">Batch Performance (Avg Score & Pass Rate)</h5>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={batchPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgScore" fill="#6366f1" name="Avg Score" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="passRate" fill="#10b981" name="Pass Rate %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* User Distribution Pie Chart */}
        <div className="col-lg-4">
          <div className="card-custom p-4 h-100">
            <h5 className="fw-bold mb-4">User Distribution</h5>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.userDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Exam Trends Line Chart */}
        <div className="col-12">
          <div className="card-custom p-4">
            <h5 className="fw-bold mb-4">Exams Conducted (Trend)</h5>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={examTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="exams" stroke="#ec4899" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;
