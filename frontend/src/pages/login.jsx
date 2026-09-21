import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Login through AuthContext
      const data = await login(email, password);

      // Debug: check complete response
      console.log("Login response:", data);

      // Check whether backend returned valid data
      if (!data || !data.user) {
        throw new Error(
          "Invalid login response from server."
        );
      }

      // Get user role
      const userRole = String(data.user.role)
        .replace("ROLE_", "")
        .toLowerCase();

      console.log("User role:", userRole);

      // Navigate according to role
      if (userRole === "donor") {
        navigate("/donor/dashboard", {
          replace: true,
        });
      } 
      
      else if (userRole === "patient") {
        navigate("/patient/dashboard", {
          replace: true,
        });
      } 
      
      else if (userRole === "admin") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } 
      
      else {
        setError(
          `Unrecognized user role: ${data.user.role}`
        );
      }

    } catch (err) {

      // Debug exact error
      console.error("Full Login Error:", err);

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message;

      setError(
        typeof backendMessage === "string"
          ? backendMessage
          : "Invalid email or password"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>🩸 BloodConnect</h1>

        <h2>Welcome Back</h2>

        <p>Login to your account</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Email */}

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          {/* Password */}

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {/* Login button */}

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p className="auth-link">
          Don't have an account?{" "}

          <Link to="/signup">
            Create Account
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;