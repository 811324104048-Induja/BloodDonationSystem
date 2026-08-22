import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import donorService from "../../services/donorService";

const DonorProfile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await donorService.getProfile();

      setProfile(data.donor || data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!profile) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <Navbar />

      <div className="layout">

        <Sidebar />

        <main className="main-content">

          <div className="page-header">
            <h1>My Profile</h1>

            <button
              className="primary-btn small"
              onClick={() =>
                navigate("/donor/profile/edit")
              }
            >
              Edit Profile
            </button>
          </div>

          <div className="profile-card">

            <div className="profile-avatar">
              {profile.name?.charAt(0)}
            </div>

            <h2>{profile.name}</h2>

            <div className="profile-info">

              <p>
                <strong>Email:</strong>{" "}
                {profile.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {profile.phone}
              </p>

              <p>
                <strong>Blood Group:</strong>{" "}
                {profile.blood_group}
              </p>

              <p>
                <strong>Age:</strong>{" "}
                {profile.age}
              </p>

              <p>
                <strong>Gender:</strong>{" "}
                {profile.gender}
              </p>

              <p>
                <strong>City:</strong>{" "}
                {profile.city}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {profile.address}
              </p>

              <p>
                <strong>Availability:</strong>{" "}
                {profile.available
                  ? "Available"
                  : "Unavailable"}
              </p>

              <p>
                <strong>Last Donation:</strong>{" "}
                {profile.last_donation_date ||
                  "Not recorded"}
              </p>

            </div>

          </div>

        </main>

      </div>
    </>
  );
};

export default DonorProfile;