import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import donorService from "../../services/donorService";
import matchService from "../../services/matchService";

const MatchedRequests = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const data =
        await donorService.getMatchedRequests();

      setMatches(
        data.matches || data || []
      );

    } catch (error) {
      console.error(error);
    }
  };

  const acceptMatch = async (id) => {
    try {
      await matchService.acceptMatch(id);

      alert(
        "Match accepted. The patient will be notified."
      );

      loadMatches();

    } catch (error) {
      alert("Unable to accept match");
    }
  };

  const rejectMatch = async (id) => {
    try {
      await matchService.rejectMatch(id);

      loadMatches();

    } catch (error) {
      alert("Unable to reject match");
    }
  };

  return (
    <>
      <Navbar />

      <div className="layout">

        <Sidebar />

        <main className="main-content">

          <h1>Matched Blood Requests</h1>

          {matches.length === 0 ? (

            <div className="empty-state">
              No matching requests found.
            </div>

          ) : (

            <div className="request-grid">

              {matches.map((match) => (

                <div
                  className="request-card"
                  key={match.match_id || match.id}
                >

                  <span className="match-score">
                    Match Score:{" "}
                    {match.match_score || "-"}
                  </span>

                  <h2>
                    🩸 {match.blood_group}
                  </h2>

                  <p>
                    📍 {match.city}
                  </p>

                  <p>
                    🏥 {match.hospital_name}
                  </p>

                  <p>
                    Units:{" "}
                    {match.units_required}
                  </p>

                  <p>
                    Urgency:{" "}
                    <strong>
                      {match.urgency}
                    </strong>
                  </p>

                  <div className="button-group">

                    <button
                      className="accept-btn"
                      onClick={() =>
                        acceptMatch(
                          match.match_id ||
                          match.id
                        )
                      }
                    >
                      Accept
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() =>
                        rejectMatch(
                          match.match_id ||
                          match.id
                        )
                      }
                    >
                      Reject
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

export default MatchedRequests;