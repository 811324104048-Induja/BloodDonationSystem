import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "./MyRequests.css";

const MyRequests = () => {

  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchRequests = async () => {

      try {

        const response = await api.get(
          "/blood-requests/my-requests"
        );

        setRequests(response.data);

      } catch (error) {

        console.error(
          "Failed to fetch requests:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load blood requests."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchRequests();

  }, []);

  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return (
      <>
        <Navbar />

        <div className="layout">

          <Sidebar />

          <main className="main-content">

            <div className="requests-loading">
              Loading requests...
            </div>

          </main>

        </div>
      </>
    );

  }

  /* =========================
     MAIN PAGE
  ========================= */

  return (
    <>
      <Navbar />

      <div className="layout">

        <Sidebar />

        <main className="main-content">

          {/* PAGE HEADER */}

          <div className="page-header">

            <div>

              <h1>
                📋 My Blood Requests
              </h1>

              <p>
                Track and manage your blood requests.
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/patient/create-request")
              }
            >
              + New Request
            </button>

          </div>


          {/* =========================
              ERROR
          ========================= */}

          {error && (

            <div className="error-message">
              {error}
            </div>

          )}


          {/* =========================
              NO REQUESTS
          ========================= */}

          {!error && requests.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                🩸
              </div>

              <h2>
                No Blood Requests Yet
              </h2>

              <p>
                You haven't created any blood requests.
                Create one when you need blood.
              </p>

              <button
                onClick={() =>
                  navigate("/patient/create-request")
                }
              >
                + Create Blood Request
              </button>

            </div>

          ) : (

            /* =========================
               REQUEST LIST
            ========================= */

            <div className="request-list">

              {requests.map((request) => (

                <div
                  className="request-card"
                  key={request.requestId}
                >

                  {/* LEFT SIDE */}

                  <div>

                    <h3>
                      🩸 {request.bloodGroup}
                    </h3>

                    <p>
                      🏥 {request.hospitalName}
                    </p>

                    <p>
                      📍 {request.city}
                    </p>

                    <p>
                      🩸 Units Required:{" "}
                      {request.unitsRequired}
                    </p>

                  </div>


                  {/* RIGHT SIDE */}

                  <div>

                    <span
                      className={`status ${
                        request.status
                          ?.toLowerCase()
                          .replaceAll(" ", "_")
                      }`}
                    >
                      {request.status}
                    </span>

                    <p>
                      🚨 Urgency:{" "}
                      {request.urgency}
                    </p>

                    <button
                      onClick={() =>
                        navigate(
                          `/patient/requests/${request.requestId}`
                        )
                      }
                    >
                      View Details →
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </main>

      </div>
    </>
  );
};

export default MyRequests;