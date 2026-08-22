import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const response =
        await api.get("/admin/audit-logs");

      setLogs(
        response.data.logs ||
        response.data ||
        []
      );

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

          <h1>Security Audit Logs</h1>

          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>IP</th>
                  <th>Date</th>
                </tr>

              </thead>

              <tbody>

                {logs.map((log) => (

                  <tr key={log.log_id}>

                    <td>
                      {log.user_email}
                    </td>

                    <td>
                      {log.action}
                    </td>

                    <td>
                      {log.ip_address}
                    </td>

                    <td>
                      {log.created_at}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </main>

      </div>
    </>
  );
};

export default AuditLogs;