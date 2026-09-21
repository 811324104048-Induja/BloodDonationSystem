import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

import requestService from "../../services/requestService";
import matchService from "../../services/matchService";

const RequestDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [matches, setMatches] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    loadDetails();

  }, [id]);

  const loadDetails = async () => {

    try {

      setLoading(true);
      setError("");

      // Get blood request
      const requestData =
        await requestService.getRequestById(id);

      console.log(
        "Request details:",
        requestData
      );

      setRequest(
        requestData.request ||
        requestData
      );


      // Get matched donors
      try {

        const matchData =
          await matchService.getMatchesForRequest(id);

        console.log(
          "Match details:",
          matchData
        );

        setMatches(
          matchData.matches ||
          matchData ||
          []
        );

      } catch (matchError) {

        console.error(
          "Failed to load matches:",
          matchError
        );

        // Don't prevent request details
        // from being displayed if matching fails
        setMatches([]);

      }

    } catch (error) {

      console.error(
        "Failed to load request details:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load blood request."
      );

    } finally {

      setLoading(false);

    }
  };


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

            <div className="loading">
              Loading request details...
            </div>

          </main>

        </div>
      </>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (error) {

    return (
      <>
        <Navbar />

        <div className="layout">

          <Sidebar />

          <main className="main-content">

            <div className="error-message">
              {error}
            </div>

            <button
              onClick={() =>
                navigate("/patient/requests")
              }
            >
              ← Back to My Requests
            </button>

          </main>

        </div>
      </>
    );
  }


  /* =========================
     NO REQUEST
  ========================= */

  if (!request) {

    return (
      <>
        <Navbar />

        <div className="layout">

          <Sidebar />

          <main className="main-content">

            <div className="empty-state">
              Blood request not found.
            </div>

            <button
              onClick={() =>
                navigate("/patient/requests")
              }
            >
              ← Back to My Requests
            </button>

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

          {/* HEADER */}

          <div className="page-header">

            <div>

              <h1>
                🩸 Blood Request Details
              </h1>

              <p>
                View the details of your blood request.
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/patient/requests")
              }
            >
              ← Back to Requests
            </button>

          </div>


          {/* REQUEST DETAILS */}

          <div className="details-card">

            <h2>
              🩸 {request.bloodGroup || "-"}
            </h2>

            <p>
              <strong>
                Units Required:
              </strong>{" "}
              {request.unitsRequired || "-"}
            </p>

            <p>
              <strong>
                Hospital:
              </strong>{" "}
              {request.hospitalName || "-"}
            </p>

            <p>
              <strong>
                City:
              </strong>{" "}
              {request.city || "-"}
            </p>

            <p>
              <strong>
                Address:
              </strong>{" "}
              {request.address || "-"}
            </p>

            <p>
              <strong>
                Urgency:
              </strong>{" "}
              {request.urgency || "-"}
            </p>

            <p>
              <strong>
                Status:
              </strong>{" "}
              {request.status || "-"}
            </p>

            <p>
              <strong>
                Required Date:
              </strong>{" "}
              {request.requiredDate || "-"}
            </p>

            <p>
              <strong>
                Description:
              </strong>{" "}
              {request.description || "-"}
            </p>

          </div>


          {/* MATCHED DONORS */}

          <div className="dashboard-section">

            <h2>
              Matched Donors
            </h2>

            {matches.length === 0 ? (

              <div className="empty-state">

                Matching donors are being searched...

              </div>

            ) : (

              <div className="request-grid">

                {matches.map((match) => (

                  <div
                    className="request-card"
                    key={
                      match.matchId ||
                      match.match_id ||
                      match.id
                    }
                  >

                    <h3>
                      🩸 Compatible Donor
                    </h3>

                    <p>
                      Match Score:{" "}
                      <strong>
                        {match.matchScore ||
                          match.match_score ||
                          "-"}
                      </strong>
                    </p>

                    <p>
                      Distance:{" "}
                      {match.distanceKm ||
                        match.distance_km ||
                        "-"}{" "}
                      km
                    </p>

                    <p>
                      Availability:{" "}
                      {match.available
                        ? "Available"
                        : "Unavailable"}
                    </p>

                    <p>
                      Status:{" "}
                      {match.status || "-"}
                    </p>

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

export default RequestDetails;