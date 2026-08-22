import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import requestService from "../../services/requestService";
import matchService from "../../services/matchService";

const RequestDetails = () => {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    loadDetails();
  }, [id]);

  const loadDetails = async () => {
    try {
      const requestData =
        await requestService.getRequestById(id);

      const matchData =
        await matchService.getMatchesForRequest(id);

      setRequest(
        requestData.request || requestData
      );

      setMatches(
        matchData.matches || matchData || []
      );

    } catch (error) {
      console.error(error);
    }
  };

  if (!request) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <Navbar />

      <div className="layout">

        <Sidebar />

        <main className="main-content">

          <h1>Blood Request Details</h1>

          <div className="details-card">

            <h2>
              🩸 {request.blood_group}
            </h2>

            <p>
              <strong>Units:</strong>{" "}
              {request.units_required}
            </p>

            <p>
              <strong>Hospital:</strong>{" "}
              {request.hospital_name}
            </p>

            <p>
              <strong>City:</strong>{" "}
              {request.city}
            </p>

            <p>
              <strong>Urgency:</strong>{" "}
              {request.urgency}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {request.status}
            </p>

            <p>
              <strong>Required Date:</strong>{" "}
              {request.required_date}
            </p>

          </div>

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
                        {match.match_score}
                      </strong>
                    </p>

                    <p>
                      Distance:{" "}
                      {match.distance_km || "-"} km
                    </p>

                    <p>
                      Availability:{" "}
                      {match.available
                        ? "Available"
                        : "Unavailable"}
                    </p>

                    <p>
                      Status:{" "}
                      {match.status}
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