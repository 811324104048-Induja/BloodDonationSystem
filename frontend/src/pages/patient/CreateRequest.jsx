import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "./CreateRequest.css";

const CreateRequest = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    bloodGroup: "",
    unitsRequired: 1,
    hospitalName: "",
    city: "",
    address: "",
    urgency: "NORMAL",
    requiredDate: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      // JWT token is automatically added by api.js
      // No user ID or patient ID is required
      await api.post(
        "/blood-requests",
        form
      );

      alert(
        "Blood request created successfully!"
      );

      navigate("/patient/requests");

    } catch (err) {

      console.error(
        "Create blood request error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to create blood request."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <>
      <Navbar />

      <div className="layout">

        <Sidebar />

        <main className="main-content">

          <div className="request-page-header">

            <div>

              <h1>
                🩸 Create Blood Request
              </h1>

              <p>
                Provide the required details to find
                suitable blood donors.
              </p>

            </div>

          </div>

          <div className="request-form-card">

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <label>
                Blood Group
              </label>

              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select blood group
                </option>

                <option value="A+">
                  A+
                </option>

                <option value="A-">
                  A-
                </option>

                <option value="B+">
                  B+
                </option>

                <option value="B-">
                  B-
                </option>

                <option value="AB+">
                  AB+
                </option>

                <option value="AB-">
                  AB-
                </option>

                <option value="O+">
                  O+
                </option>

                <option value="O-">
                  O-
                </option>

              </select>

              <label>
                Units Required
              </label>

              <input
                type="number"
                name="unitsRequired"
                min="1"
                max="10"
                value={form.unitsRequired}
                onChange={handleChange}
                required
              />

              <label>
                Hospital Name
              </label>

              <input
                type="text"
                name="hospitalName"
                placeholder="Enter hospital name"
                value={form.hospitalName}
                onChange={handleChange}
                required
              />

              <label>
                City
              </label>

              <input
                type="text"
                name="city"
                placeholder="Enter city"
                value={form.city}
                onChange={handleChange}
                required
              />

              <label>
                Address
              </label>

              <input
                type="text"
                name="address"
                placeholder="Hospital address"
                value={form.address}
                onChange={handleChange}
              />

              <label>
                Urgency
              </label>

              <select
                name="urgency"
                value={form.urgency}
                onChange={handleChange}
                required
              >

                <option value="NORMAL">
                  Normal
                </option>

                <option value="URGENT">
                  Urgent
                </option>

                <option value="CRITICAL">
                  Critical
                </option>

              </select>

              <label>
                Required Date
              </label>

              <input
                type="date"
                name="requiredDate"
                value={form.requiredDate}
                onChange={handleChange}
                required
              />

              <label>
                Description
              </label>

              <textarea
                name="description"
                placeholder="Additional information"
                value={form.description}
                onChange={handleChange}
                rows="4"
              />

              <button
                type="submit"
                className="create-request-btn"
                disabled={loading}
              >

                {loading
                  ? "Creating..."
                  : "🩸 Create Blood Request"}

              </button>

            </form>

            <button
              className="back-dashboard-btn"
              onClick={() =>
                navigate("/patient/dashboard")
              }
            >
              ← Back to Dashboard
            </button>

          </div>

        </main>

      </div>
    </>
  );
};

export default CreateRequest;