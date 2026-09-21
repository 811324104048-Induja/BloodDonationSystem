import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import patientService from "../../services/patientService";
import "./EditPatientProfile.css";

const EditPatientProfile = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    hospitalName: "",
    city: "",
    address: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {

    try {

      const data =
        await patientService.getProfile();

      setForm({
        name: data.user?.name || "",
        phone: data.user?.phone || "",
        hospitalName: data.hospitalName || "",
        city: data.city || "",
        address: data.address || ""
      });

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to load profile"
      );

    } finally {

      setLoading(false);

    }
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSaving(true);
    setError("");

    try {

      await patientService.updateProfile(form);

      alert("Profile updated successfully!");

      navigate("/patient/profile");

    } catch (error) {

      console.error(
        "Profile update error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to update profile"
      );

    } finally {

      setSaving(false);

    }
  };

  if (loading) {

    return (
      <div className="loading">
        Loading profile...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="layout">

        <Sidebar />

        <main className="main-content">

          <div className="edit-patient-header">

            <div>
              <h1>Edit Patient Profile</h1>

              <p>
                Update your personal and hospital information
              </p>
            </div>

          </div>

          {error && (
            <div className="patient-edit-error">
              {error}
            </div>
          )}

          <form
            className="edit-patient-form"
            onSubmit={handleSubmit}
          >

            <div className="form-section-title">
              Personal Information
            </div>

            <label>Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>

            <input
              type="email"
              value={
                JSON.parse(
                  localStorage.getItem("user")
                )?.email || ""
              }
              disabled
            />

            <label>Phone</label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <div className="form-section-title">
              Hospital Information
            </div>

            <label>Hospital Name</label>

            <input
              type="text"
              name="hospitalName"
              placeholder="Enter hospital name"
              value={form.hospitalName}
              onChange={handleChange}
            />

            <label>City</label>

            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={form.city}
              onChange={handleChange}
            />

            <label>Address</label>

            <textarea
              name="address"
              placeholder="Enter address"
              value={form.address}
              onChange={handleChange}
              rows="4"
            />

            <div className="edit-patient-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() =>
                  navigate("/patient/profile")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-patient-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </main>

      </div>
    </>
  );
};

export default EditPatientProfile;