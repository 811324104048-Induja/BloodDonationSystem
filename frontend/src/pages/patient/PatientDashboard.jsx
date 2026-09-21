import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./PatientDashboard.css";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const PatientDashboard = () => {

  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="layout">

        <Sidebar />

        <main className="main-content">

          {/* HEADER */}

          <header className="dashboard-header">

            <div>
              <h1>
                Welcome, {user?.name || "Patient"} 👋
              </h1>

              <p>
                Manage your blood requests and find
                suitable donors.
              </p>
            </div>

            <button
              className="profile-button"
              onClick={() =>
                navigate("/patient/profile")
              }
            >
              👤 Profile
            </button>

          </header>


          {/* STAT CARDS */}

          <section className="stats">

            <div className="stat-card">

              <span>🩸</span>

              <h3>
                Active Requests
              </h3>

              <strong>
                0
              </strong>

            </div>


            <div className="stat-card">

              <span>👥</span>

              <h3>
                Matched Donors
              </h3>

              <strong>
                0
              </strong>

            </div>


            <div className="stat-card">

              <span>🚨</span>

              <h3>
                Emergency Requests
              </h3>

              <strong>
                0
              </strong>

            </div>

          </section>


          {/* QUICK ACTIONS */}

          <section>

            <h2>
              Quick Actions
            </h2>

            <div className="actions">

              <button
                onClick={() =>
                  navigate("/patient/create-request")
                }
              >

                <span>🩸</span>

                <strong>
                  Create Blood Request
                </strong>

                <small>
                  Request blood from nearby donors
                </small>

              </button>


              <button
                onClick={() =>
                  navigate("/patient/requests")
                }
              >

                <span>📋</span>

                <strong>
                  View My Requests
                </strong>

                <small>
                  Track your existing requests
                </small>

              </button>


              <button
                onClick={() =>
                  navigate("/patient/profile")
                }
              >

                <span>👤</span>

                <strong>
                  My Profile
                </strong>

                <small>
                  View and update your information
                </small>

              </button>

            </div>

          </section>


          {/* INFORMATION */}

          <section className="info-card">

            <h2>
              How BloodConnect Works
            </h2>

            <div className="steps">

              <div>
                <b>1</b>
                <p>
                  Create a blood request
                </p>
              </div>


              <div>
                <b>2</b>
                <p>
                  Our system finds suitable donors
                </p>
              </div>


              <div>
                <b>3</b>
                <p>
                  Contact matched donors
                </p>
              </div>


              <div>
                <b>4</b>
                <p>
                  Receive the required blood
                </p>
              </div>

            </div>

          </section>

        </main>

      </div>
    </>
  );
};

export default PatientDashboard;