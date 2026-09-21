import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "DONOR",
    age: "",
    gender: "",
    bloodGroup: "",
    city: "",
    address: "",
    hospitalName: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      // Build payload - convert age to number, only send relevant fields
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
        city: form.city,
        address: form.address,
      };

      if (form.role === "DONOR") {
        payload.age = form.age ? parseInt(form.age, 10) : null;
        payload.gender = form.gender;
        payload.bloodGroup = form.bloodGroup;
      }

      if (form.role === "PATIENT") {
        payload.hospitalName = form.hospitalName;
      }

      await signup(payload);

      setSuccess(
        "Account created successfully. Please login."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Signup failed"
      );
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>🩸 BloodConnect</h1>

        <h2>Create Account</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>Full Name</label>

          <input
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Phone</label>

          <input
            name="phone"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
            required
            minLength="6"
          />

          <label>Account Type</label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="DONOR">Donor</option>
            <option value="PATIENT">Patient</option>
          </select>

          <label>City</label>

          <input
            name="city"
            placeholder="Enter your city"
            value={form.city}
            onChange={handleChange}
            required
          />

          <label>Address</label>

          <input
            name="address"
            placeholder="Enter your address"
            value={form.address}
            onChange={handleChange}
          />

          {form.role === "DONOR" && (
            <>
              <label>Age</label>

              <input
                type="number"
                name="age"
                placeholder="Enter your age"
                value={form.age}
                onChange={handleChange}
                required
                min="18"
                max="65"
              />

              <label>Gender</label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>

              <label>Blood Group</label>

              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                required
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </>
          )}

          {form.role === "PATIENT" && (
            <>
              <label>Hospital Name</label>

              <input
                name="hospitalName"
                placeholder="Enter hospital name (optional)"
                value={form.hospitalName}
                onChange={handleChange}
              />
            </>
          )}

          <button className="primary-btn">
            Create Account
          </button>

        </form>

        <p className="auth-link">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Signup;