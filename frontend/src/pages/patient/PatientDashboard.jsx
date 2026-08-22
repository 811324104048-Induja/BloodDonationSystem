import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import requestService from "../../services/requestService";

const PatientDashboard = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data =
        await requestService.getMyRequests();

      setRequests(
        data.requests || data || []
      );

    } catch (error) {
      console.error(error);
    }
  };

  const activeRequests = requests.filter(
    (r) =>
      r.status !== "Completed" &&
      r.status !== "Cancelled"
  );

  return (
    <>
      <Navbar />

      <div className="layout">

        <Sidebar />

        <main className="main-content">

          <div className="page-header">

            <div>
              <h1>Patient Dashboard</h1>

              <p>
                Request blood and find suitable donors.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={() =>
                navigate("/patient/create-request")
              }
            >
              + Request Blood
            </button>

          </div>

          <div className="stats-grid">

            <div className="stat-card">
              <h3>Total Requests</h3>
              <strong>
                {requests.length}
              </strong>
            </div>

            <div className="stat-card">
              <h3>Active Requests</h3>
              <strong>
                {activeRequests.length}
              </strong>
            </div>

            <div className="stat-card">
              <h3>Completed</h3>
              <strong>
                {
                  requests.filter(
                    (r) => r.status === "Completed"
                  ).length
                }
              </strong>
            </div>

          </div>

          <div className="dashboard-section">

            <h2>Recent Requests</h2>

            {requests.length === 0 ? (

              <div className="empty-state">
                You haven't created any blood requests.
              </div>

            ) : (

              <div className="request-grid">

                {requests.slice(0, 4).map((request) => (

                  <div
                    className="request-card"
                    key={
                      request.request_id ||
                      request.id
                    }
                  >

                    <h3>
                      🩸 {request.blood_group}
                    </h3>

                    <p>
                      {request.units_required} units
                    </p>

                    <p>
                      📍 {request.city}
                    </p>

                    <p>
                      Status:{" "}
                      <strong>
                        {request.status}
                      </strong>
                    </p>

                    <button
                      onClick={() =>
                        navigate(
                          `/patient/requests/${
                            request.request_id ||
                            request.id
                          }`
                        )
                      }
                    >
                      View Details
                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

        </main>

      </div>
    </>
  );
};

export default PatientDashboard;