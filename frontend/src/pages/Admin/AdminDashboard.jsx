import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    donors: 0,
    requests: 0,
    critical: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response =
        await api.get("/admin/stats");

      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="layout">

        <Sidebar />

        <main className="main-content">

          <h1>Admin Dashboard</h1>

          <div className="stats-grid">

            <div className="stat-card">
              <h3>Total Users</h3>
              <strong>{stats.users}</strong>
            </div>

            <div className="stat-card">
              <h3>Total Donors</h3>
              <strong>{stats.donors}</strong>
            </div>

            <div className="stat-card">
              <h3>Blood Requests</h3>
              <strong>{stats.requests}</strong>
            </div>

            <div className="stat-card">
              <h3>Critical Requests</h3>
              <strong>{stats.critical}</strong>
            </div>

          </div>

        </main>

      </div>
    </>
  );
};

export default AdminDashboard;