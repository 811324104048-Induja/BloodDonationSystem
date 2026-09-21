import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "./DonorDashboard.css";

const DonorDashboard = () => {

  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* Common Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="layout">

        {/* Common Sidebar */}
        <Sidebar />

        {/* Dashboard Content */}
        <main className="main-content">

          {/* Dashboard Header */}
          <header className="dashboard-header">

            <div>
              <h1>
                Welcome, {user?.name || "Donor"} ❤️
              </h1>

              <p>
                Your donation can save someone's life.
              </p>
            </div>

            <button
              className="profile-button"
              onClick={() =>
                navigate("/donor/profile")
              }
            >
              👤 Profile
            </button>

          </header>


          {/* Statistics */}
          <section className="stats">

            <div className="stat-card">
              <span>🩸</span>

              <h3>Blood Group</h3>

              <strong>--</strong>
            </div>


            <div className="stat-card">
              <span>🚨</span>

              <h3>Matched Requests</h3>

              <strong>0</strong>
            </div>


            <div className="stat-card">
              <span>❤️</span>

              <h3>Donations</h3>

              <strong>0</strong>
            </div>


            <div className="stat-card">
              <span>🟢</span>

              <h3>Availability</h3>

              <strong>Available</strong>
            </div>

          </section>


          {/* Quick Actions */}
          <section>

            <h2>Quick Actions</h2>

            <div className="actions">

              <button
                onClick={() =>
                  navigate("/donor/profile")
                }
              >
                <span>👤</span>

                <strong>My Profile</strong>

                <small>
                  View and update your donor information
                </small>
              </button>


              <button
                onClick={() =>
                  navigate("/donor/matches")
                }
              >
                <span>🚨</span>

                <strong>Emergency Requests</strong>

                <small>
                  Find blood requests that match you
                </small>
              </button>


              <button
                onClick={() =>
                  navigate("/donor/history")
                }
              >
                <span>📋</span>

                <strong>Donation History</strong>

                <small>
                  View your previous donations
                </small>
              </button>

            </div>

          </section>


          {/* Why Donate */}
          <section className="info-card">

            <h2>Why Donate Blood?</h2>

            <div className="steps">

              <div>
                <b>❤️</b>
                <p>Save lives</p>
              </div>

              <div>
                <b>🩸</b>
                <p>Help emergency patients</p>
              </div>

              <div>
                <b>🤝</b>
                <p>Support your community</p>
              </div>

            </div>

          </section>

        </main>

      </div>
    </>
  );
};

export default DonorDashboard;