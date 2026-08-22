import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import donorService from "../../services/donorService";

const DonorDashboard = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const profileData =
        await donorService.getProfile();

      const matchData =
        await donorService.getMatchedRequests();

      setProfile(profileData.donor || profileData);
      setAvailable(
        profileData.donor?.available ||
        profileData.available ||
        false
      );

      setMatches(
        matchData.matches ||
        matchData ||
        []
      );

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      await donorService.updateAvailability(
        !available
      );

      setAvailable(!available);

    } catch (error) {
      alert("Unable to update availability");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <Navbar />

      <div className="layout">

        <Sidebar />

        <main className="main-content">

          <div className="page-header">
            <div>
              <h1>Donor Dashboard</h1>
              <p>
                Help save lives by donating blood.
              </p>
            </div>

            <button
              className={
                available
                  ? "available-btn"
                  : "unavailable-btn"
              }
              onClick={toggleAvailability}
            >
              {available
                ? "🟢 Available"
                : "🔴 Not Available"}
            </button>
          </div>

          <div className="stats-grid">

            <div className="stat-card">
              <h3>Blood Group</h3>
              <strong>
                {profile?.blood_group || "Not set"}
              </strong>
            </div>

            <div className="stat-card">
              <h3>Location</h3>
              <strong>
                {profile?.city || "Not set"}
              </strong>
            </div>

            <div className="stat-card">
              <h3>Matched Requests</h3>
              <strong>
                {matches.length}
              </strong>
            </div>

            <div className="stat-card">
              <h3>Status</h3>
              <strong>
                {available
                  ? "Available"
                  : "Unavailable"}
              </strong>
            </div>

          </div>

          <div className="dashboard-section">

            <div className="section-header">
              <h2>Urgent Blood Requests</h2>

              <button
                onClick={() =>
                  navigate("/donor/matches")
                }
              >
                View All
              </button>
            </div>

            {matches.length === 0 ? (
              <div className="empty-state">
                No matching requests currently.
              </div>
            ) : (
              <div className="request-grid">

                {matches.slice(0, 3).map((match) => (

                  <div
                    className="request-card"
                    key={match.match_id || match.id}
                  >

                    <span
                      className={`urgency ${
                        match.urgency?.toLowerCase()
                      }`}
                    >
                      {match.urgency || "Normal"}
                    </span>

                    <h3>
                      {match.blood_group}
                    </h3>

                    <p>
                      📍 {match.city}
                    </p>

                    <p>
                      🩸 {match.units_required} units
                    </p>

                    <p>
                      🎯 Score:{" "}
                      {match.match_score || "-"}
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

export default DonorDashboard;