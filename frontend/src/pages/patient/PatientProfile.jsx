import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

import patientService from "../../services/patientService";

import "./PatientProfile.css";


const PatientProfile = () => {

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    loadProfile();
  }, []);


  const loadProfile = async () => {

    try {

      console.log("Loading patient profile...");

      const data = await patientService.getProfile();

      console.log("Patient profile response:", data);

      setProfile(data);

    } catch (error) {

      console.error(
        "Failed to load patient profile:",
        error
      );

      console.error(
        "Status:",
        error?.response?.status
      );

      console.error(
        "Response:",
        error?.response?.data
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load patient profile"
      );

    } finally {

      setLoading(false);

    }
  };


  if (loading) {

    return (
      <div className="loading">
        Loading profile...
      </div>
    );

  }


  if (error) {

    return (
      <div className="error">
        {error}
      </div>
    );

  }


  if (!profile) {
    return null;
  }


  return (
    <>

      {/* Common Navbar */}
      <Navbar />


      <div className="layout">

        {/* Common Drawer Sidebar */}
        <Sidebar />


        <main className="main-content">


          {/* PAGE HEADER */}

          <div className="patient-profile-header">

            <div>

              <h1>
                My Profile
              </h1>

              <p>
                View and manage your personal information
              </p>

            </div>


            <button
              className="patient-edit-btn"
              onClick={() =>
                navigate("/patient/profile/edit")
              }
            >
              ✏️ Edit Profile
            </button>

          </div>



          {/* PROFILE CARD */}

          <div className="patient-profile-card">


            {/* PROFILE TOP */}

            <div className="patient-profile-top">

              <div className="patient-profile-avatar">

                {profile.user?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "P"}

              </div>


              <div>

                <h2>
                  {profile.user?.name || "Patient"}
                </h2>

                <span className="patient-role">
                  PATIENT
                </span>

              </div>

            </div>



            {/* PROFILE INFORMATION */}

            <div className="patient-profile-info">


              <div className="patient-info-row">

                <strong>
                  Name
                </strong>

                <span>
                  {profile.user?.name || "-"}
                </span>

              </div>



              <div className="patient-info-row">

                <strong>
                  Email
                </strong>

                <span>
                  {profile.user?.email || "-"}
                </span>

              </div>



              <div className="patient-info-row">

                <strong>
                  Phone
                </strong>

                <span>
                  {profile.user?.phone || "-"}
                </span>

              </div>



              <div className="patient-info-row">

                <strong>
                  Hospital
                </strong>

                <span>
                  {profile.hospitalName || "-"}
                </span>

              </div>



              <div className="patient-info-row">

                <strong>
                  City
                </strong>

                <span>
                  {profile.city || "-"}
                </span>

              </div>



              <div className="patient-info-row">

                <strong>
                  Address
                </strong>

                <span>
                  {profile.address || "-"}
                </span>

              </div>


            </div>


          </div>


        </main>

      </div>

    </>
  );
};


export default PatientProfile;