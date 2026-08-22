import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response =
        await api.get("/admin/requests");

      setRequests(
        response.data.requests ||
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

          <h1>Manage Blood Requests</h1>

          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>Blood</th>
                  <th>Units</th>
                  <th>Hospital</th>
                  <th>Urgency</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {requests.map((request) => (

                  <tr
                    key={request.request_id}
                  >

                    <td>
                      {request.blood_group}
                    </td>

                    <td>
                      {request.units_required}
                    </td>

                    <td>
                      {request.hospital_name}
                    </td>

                    <td>
                      {request.urgency}
                    </td>

                    <td>
                      {request.status}
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

export default ManageRequests;