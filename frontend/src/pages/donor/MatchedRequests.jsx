import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import matchService from "../../services/matchService";

const MatchedRequests = () => {

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMatches();
  }, []);

  // Load matches for logged-in donor
  const loadMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await matchService.getMyMatches();

      console.log("My matches:", data);

      setMatches(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error("Error loading matches:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load matching requests."
      );

    } finally {
      setLoading(false);
    }
  };

  // Accept match
  const acceptMatch = async (matchId) => {

    try {

      await matchService.acceptMatch(matchId);

      alert("Match accepted successfully.");

      // Reload matches after accepting
      loadMatches();

    } catch (error) {

      console.error("Accept match error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to accept match."
      );
    }
  };

  // Reject match
  const rejectMatch = async (matchId) => {

    try {

      await matchService.rejectMatch(matchId);

      alert("Match rejected.");

      // Reload matches after rejecting
      loadMatches();

    } catch (error) {

      console.error("Reject match error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to reject match."
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="layout">

        <Sidebar />

        <main className="main-content">

          <h1>Matched Blood Requests</h1>

          <p>
            Blood requests matched with your donor profile are shown below.
          </p>

          {/* Loading */}
          {loading && (
            <div className="empty-state">
              Loading matching requests...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="empty-state">
              {error}
            </div>
          )}

          {/* No matches */}
          {!loading && !error && matches.length === 0 && (
            <div className="empty-state">
              No matching blood requests found.
            </div>
          )}

          {/* Matches */}
          {!loading && !error && matches.length > 0 && (

            <div className="request-grid">

              {matches.map((match) => (

                <div
                  className="request-card"
                  key={match.matchId}
                >

                  {/* Match Score */}
                  <div className="match-score">
                    Match Score:{" "}
                    <strong>
                      {match.finalScore ?? "-"}
                    </strong>
                  </div>

                  {/* Blood Group */}
                  <h2>
                    🩸 {match.bloodGroup ?? "-"}
                  </h2>

                  {/* Hospital */}
                  <p>
                    🏥 <strong>Hospital:</strong>{" "}
                    {match.hospitalName ?? "-"}
                  </p>

                  {/* City */}
                  <p>
                    📍 <strong>City:</strong>{" "}
                    {match.city ?? "-"}
                  </p>

                  {/* Units */}
                  <p>
                    🩸 <strong>Units Required:</strong>{" "}
                    {match.unitsRequired ?? "-"}
                  </p>

                  {/* Urgency */}
                  <p>
                    🚨 <strong>Urgency:</strong>{" "}
                    {match.urgency ?? "-"}
                  </p>

                  {/* Compatibility */}
                  <p>
                    ✅ <strong>Compatibility Score:</strong>{" "}
                    {match.compatibilityScore ?? "-"}
                  </p>

                  {/* Availability */}
                  <p>
                    🟢 <strong>Availability Score:</strong>{" "}
                    {match.availabilityScore ?? "-"}
                  </p>

                  {/* Distance */}
                  <p>
                    📏 <strong>Distance:</strong>{" "}
                    {match.distanceKm ?? 0} km
                  </p>

                  {/* Match Reason */}
                  <p>
                    💡 <strong>Why you matched:</strong>{" "}
                    {match.matchReason ?? "-"}
                  </p>

                  {/* Status */}
                  <p>
                    📌 <strong>Status:</strong>{" "}
                    {match.status ?? "PENDING"}
                  </p>

                  {/* Buttons */}
                  {match.status === "PENDING" && (

                    <div className="button-group">

                      <button
                        className="accept-btn"
                        onClick={() =>
                          acceptMatch(match.matchId)
                        }
                      >
                        Accept
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() =>
                          rejectMatch(match.matchId)
                        }
                      >
                        Reject
                      </button>

                    </div>

                  )}

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