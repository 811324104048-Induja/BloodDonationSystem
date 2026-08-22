import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import requestService from "../../services/requestService";

const CreateRequest = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    blood_group: "",
    units_required: 1,
    hospital_name: "",
    city: "",
    address: "",
    urgency: "Normal",
    required_date: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await requestService.createRequest(form);

      alert(
        "Blood request created. Matching donors now..."
      );

      navigate("/patient/requests");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to create request"
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

          <h1>Create Blood Request</h1>

          <form
            className="form-card"
            onSubmit={handleSubmit}
          >

            <label>Blood Group</label>

            <select
              name="blood_group"
              value={form.blood_group}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Blood Group
              </option>

              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>

            <label>Units Required</label>

            <input
              type="number"
              name="units_required"
              min="1"
              max="10"
              value={form.units_required}
              onChange={handleChange}
              required
            />

            <label>Hospital Name</label>

            <input
              name="hospital_name"
              value={form.hospital_name}
              onChange={handleChange}
              required
            />

            <label>City</label>

            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />

            <label>Hospital Address</label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />

            <label>Urgency</label>

            <select
              name="urgency"
              value={form.urgency}
              onChange={handleChange}
            >
              <option value="Normal">
                Normal
              </option>

              <option value="Urgent">
                Urgent
              </option>

              <option value="Critical">
                Critical
              </option>
            </select>

            <label>Required Date</label>

            <input
              type="date"
              name="required_date"
              value={form.required_date}
              onChange={handleChange}
              required
            />

            <label>Reason</label>

            <textarea
              name="reason"
              placeholder="Briefly describe the requirement"
              value={form.reason}
              onChange={handleChange}
            />

            <button
              className="primary-btn"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Blood Request"}
            </button>

          </form>

        </main>

      </div>
    </>
  );
};

export default CreateRequest;