import { useState, useEffect } from "react";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { getAllBatches } from "../../services/admin/batchService";
import { getAllUsers } from "../../services/admin/userService";
import { getAllExams } from "../../services/admin/examService";
import { getAllResults } from "../../services/admin/resultService";
import { toast } from "react-toastify";

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6'];

const SystemAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    batchAnalytics: [],
    userDistribution: [],
    examTrends: [],
    resultDistribution: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Parallel data fetching
      const [batchesRes, usersRes, examsRes, resultsRes] = await Promise.allSettled([
        getAllBatches(),
        getAllUsers(),
        getAllExams(),
        getAllResults()
      ]);

      const batches = batchesRes.status === 'fulfilled' ? (Array.isArray(batchesRes.value) ? batchesRes.value : []) : [];
      const users = usersRes.status === 'fulfilled' ? (Array.isArray(usersRes.value) ? usersRes.value : []) : [];
      const exams = examsRes.status === 'fulfilled' ? (Array.isArray(examsRes.value) ? examsRes.value : []) : [];
      const results = resultsRes.status === 'fulfilled' ? (Array.isArray(resultsRes.value) ? resultsRes.value : []) : [];

      // 1. User Stats
      const students = users.filter(u => (u.role || "").toLowerCase() === "student");
      const instructors = users.filter(u => (u.role || "").toLowerCase() === "instructor");
      const admins = users.filter(u => (u.role || "").toLowerCase() === "admin");

      // 2. Batch-wise Analytics
      const batchStats = batches.map(batch => {
        // Users in batch
        const batchStudents = students.filter(s => s.batchId === batch.id || s.batch === batch.batchName);
        const batchInstructors = instructors.filter(i => i.batchId === batch.id || i.batch === batch.batchName); // Note: Instructors might not be strictly bound to batch

        // Exams for batch
        const batchExams = exams.filter(e => e.batchId === batch.id || e.batch === batch.batchName);

        // Results for batch exams
        const batchExamIds = batchExams.map(e => e.id);
        const batchResults = results.filter(r => batchExamIds.includes(r.examId));

        // Avg Score & Pass Rate
        const totalScore = batchResults.reduce((acc, r) => acc + (Number(r.score) || 0), 0);
        const avgScore = batchResults.length ? Math.round(totalScore / batchResults.length) : 0;

        const passingScore = 40; // Default assumption
        const passedCount = batchResults.filter(r => (Number(r.score) || 0) >= passingScore).length;
        const passRate = batchResults.length ? Math.round((passedCount / batchResults.length) * 100) : 0;

        return {
          id: batch.id,
          name: batch.batchName,
          studentCount: batchStudents.length,
          instructorCount: batchInstructors.length,
          examCount: batchExams.length,
          avgScore,
          passRate
        };
      });

      // 3. Exam Trends (Line Chart) - Group by Month
      const trendsMap = {};
      exams.forEach(exam => {
        const dateStr = exam.startDate || exam.scheduledTime || exam.createdOn; // Fallback dates
        if (dateStr) {
          const date = new Date(dateStr);
          if (!isNaN(date)) {
            const month = date.toLocaleString('default', { month: 'short' });
            trendsMap[month] = (trendsMap[month] || 0) + 1;
          }
        }
      });
      // Sort months purely for display if possible, or use predefined array
      const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const examTrends = monthsOrder.map(m => ({ month: m, exams: trendsMap[m] || 0 })).filter(item => item.exams > 0 || true).slice(0, 6); // Show first 6 or active months

      // 4. Result Distribution (Pie/Bar) - Grade Ranges
      const gradeRanges = [
        { name: '0-40% (Fail)', min: 0, max: 39 },
        { name: '40-60%', min: 40, max: 60 },
        { name: '60-80%', min: 61, max: 80 },
        { name: '80-100%', min: 81, max: 100 }
      ];
      const resultDist = gradeRanges.map(range => ({
        name: range.name,
        value: results.filter(r => {
          const s = Number(r.score) || 0;
          return s >= range.min && s <= range.max;
        }).length
      }));

      setAnalyticsData({
        totalStudents: students.length,
        totalInstructors: instructors.length,
        batchAnalytics: batchStats,
        userDistribution: [
          { name: 'Students', value: students.length },
          { name: 'Instructors', value: instructors.length },
          { name: 'Admins', value: admins.length }
        ],
        examTrends,
        resultDistribution: resultDist
      });

    } catch (err) {
      console.error("Failed to load analytics", err);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-5 text-center fw-bold text-muted">Loading System Analytics...</div>;

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold text-gradient mb-4">System Analytics</h2>

      {/* User Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card-custom p-4 d-flex align-items-center bg-white shadow-sm border-0">
            <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-4">
              <FaUserGraduate className="text-primary fs-2" />
            </div>
            <div>
              <h3 className="fw-bold mb-0">{analyticsData.totalStudents}</h3>
              <div className="text-muted">All Students</div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-custom p-4 d-flex align-items-center bg-white shadow-sm border-0">
            <div className="rounded-circle bg-secondary bg-opacity-10 p-3 me-4">
              <FaChalkboardTeacher className="text-secondary fs-2" />
            </div>
            <div>
              <h3 className="fw-bold mb-0">{analyticsData.totalInstructors}</h3>
              <div className="text-muted">All Instructors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="row g-4 mb-4">
        {/* Batch Student Distribution */}
        <div className="col-lg-8">
          <div className="card-custom p-4 h-100 shadow-sm border-0">
            <h5 className="fw-bold mb-4">Batch Distribution (Students)</h5>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.batchAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="studentCount" fill="#6366f1" name="Students" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* User Roles Pie Chart */}
        <div className="col-lg-4">
          <div className="card-custom p-4 h-100 shadow-sm border-0">
            <h5 className="fw-bold mb-4">User Roles</h5>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.userDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.userDistribution.map((entry, index) => (
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
      </div>

      {/* Charts Row 2 */}
      <div className="row g-4 mb-5">
        {/* Exam Trends */}
        <div className="col-lg-6">
          <div className="card-custom p-4 shadow-sm border-0">
            <h5 className="fw-bold mb-4">Exams Conducted (Monthly Trend)</h5>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.examTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="exams" stroke="#ec4899" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Results Distribution */}
        <div className="col-lg-6">
          <div className="card-custom p-4 shadow-sm border-0">
            <h5 className="fw-bold mb-4">Results Distribution</h5>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.resultDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#10b981" name="Students" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Analytics Table */}
      <div className="card-custom p-4 shadow-sm border-0 mb-4">
        <h5 className="fw-bold mb-4">Batch-wise Detailed Analytics</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Batch Name</th>
                <th className="text-center">Total Students</th>
                <th className="text-center">Total Instructors</th>
                <th className="text-center">Exams Conducted</th>
                <th className="text-center">Avg. Score</th>
                <th className="text-center">Pass Rate</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.batchAnalytics.length === 0 ? (
                <tr><td colSpan="6" className="text-center p-3">No batch data available</td></tr>
              ) : (
                analyticsData.batchAnalytics.map(batch => (
                  <tr key={batch.id}>
                    <td className="fw-medium">{batch.name}</td>
                    <td className="text-center">{batch.studentCount}</td>
                    <td className="text-center">{batch.instructorCount}</td>
                    <td className="text-center">{batch.examCount}</td>
                    <td className="text-center">
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary">
                        {batch.avgScore}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <div className="progress" style={{ width: '60px', height: '6px' }}>
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: `${batch.passRate}%` }}
                          ></div>
                        </div>
                        <small>{batch.passRate}%</small>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;
