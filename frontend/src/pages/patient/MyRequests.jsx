import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import matchService from "../../services/matchService";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "./MyRequests.css";

const MyRequests = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/blood-requests/my-requests"
        );

        const requestList = Array.isArray(response.data)
          ? response.data
          : [];

        // Get match statuses for every blood request.
        const updatedRequests = await Promise.all(
          requestList.map(async (request) => {
            try {
              const matchResponse =
                await matchService.getMatchesForRequest(
                  request.requestId
                );

              const matches = Array.isArray(matchResponse)
                ? matchResponse
                : Array.isArray(matchResponse?.matches)
                ? matchResponse.matches
                : [];

              const statuses = matches.map((match) =>
                String(match.status || "").toUpperCase()
              );

              let displayStatus = request.status;

              // If at least one donor accepts, show ACCEPTED.
              if (statuses.includes("ACCEPTED")) {
                displayStatus = "ACCEPTED";
              }
              // Show REJECTED only when all matched donors rejected.
              else if (
                statuses.length > 0 &&
                statuses.every(
                  (status) => status === "REJECTED"
                )
              ) {
                displayStatus = "REJECTED";
              }

              return {
                ...request,
                displayStatus,
              };
            } catch (matchError) {
              console.error(
                `Failed to fetch matches for request ${request.requestId}:`,
                matchError
              );

              // Preserve the original status if matches cannot load.
              return {
                ...request,
                displayStatus: request.status,
              };
            }
          })
        );

        if (active) {
          setRequests(updatedRequests);
        }
      } catch (fetchError) {
        console.error(
          "Failed to fetch requests:",
          fetchError
        );

        if (active) {
          setError(
            fetchError.response?.data?.message ||
              "Failed to load blood requests."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchRequests();

    return () => {
      active = false;
    };
  }, []);

  const getStatusClass = (status) => {
    return String(status || "PENDING")
      .toLowerCase()
      .replaceAll(" ", "_");
  };

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

  return (
    <>
      <Navbar />

      <div className="layout">
        <Sidebar />

        <main className="main-content">
          {/* PAGE HEADER */}
          <div className="page-header">
            <div>
              <h1>📋 My Blood Requests</h1>

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

          {/* ERROR */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* NO REQUESTS */}
          {!error && requests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🩸</div>

              <h2>No Blood Requests Yet</h2>

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
            /* REQUEST LIST */
            <div className="request-list">
              {requests.map((request) => {
                const status =
                  request.displayStatus ||
                  request.status ||
                  "PENDING";

                return (
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
                        className={`status ${getStatusClass(
                          status
                        )}`}
                      >
                        {status}
                      </span>

                      <p>
                        🚨 Urgency: {request.urgency}
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
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default MyRequests;