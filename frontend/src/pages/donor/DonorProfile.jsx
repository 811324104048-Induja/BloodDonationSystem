import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import donorService from "../../services/donorService";
import "./DonorProfile.css";

const DonorProfile = () => {
  const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
  try {
    console.log("Loading donor profile...");

    const data = await donorService.getProfile();

    console.log("Profile response:", data);

    setProfile(data?.donor || data);
  } catch (error) {
    console.error("Failed to load donor profile:", error);
    console.error("Status:", error?.response?.status);
    console.error("Response:", error?.response?.data);

    setError(
      error?.response?.data?.message ||
      "Unable to load donor profile"
    );
  } finally {
    setLoading(false);
  }
};

if (loading) {
  return <div className="loading">Loading...</div>;
}

if (error) {
  return <div className="error">{error}</div>;
}
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
              onClick={() => navigate("/donor/profile/edit")}
            >
              Edit Profile
            </button>
          </div>

          <div className="profile-card">

            <div className="profile-avatar">
              {profile.user?.name?.charAt(0)?.toUpperCase() || "D"}
            </div>

            <h2>{profile.user?.name || "Donor"}</h2>

            <div className="profile-info">

              <p>
                <strong>Email:</strong>{" "}
                {profile.user?.email || "-"}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {profile.user?.phone || "-"}
              </p>

              <p>
                <strong>Blood Group:</strong>{" "}
                {profile.bloodGroup || "-"}
              </p>

              <p>
                <strong>Age:</strong>{" "}
                {profile.age || "-"}
              </p>

              <p>
                <strong>Gender:</strong>{" "}
                {profile.gender || "-"}
              </p>

              <p>
                <strong>City:</strong>{" "}
                {profile.city || "-"}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {profile.address || "-"}
              </p>

              <p>
                <strong>Availability:</strong>{" "}
                {profile.available
                  ? "Available"
                  : "Unavailable"}
              </p>

              <p>
                <strong>Last Donation:</strong>{" "}
                {profile.lastDonationDate || "Not recorded"}
              </p>

            </div>

          </div>

        </main>
      </div>
    </>
  );
};

export default DonorProfile;