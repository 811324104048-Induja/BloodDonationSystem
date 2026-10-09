import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {

  const { login, verifyOtp } = useAuth();
  const navigate = useNavigate();

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP
  const [otp, setOtp] = useState("");

  // Screen control
  const [otpStep, setOtpStep] = useState(false);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  // -----------------------------
  // PASSWORD VALIDATION
  // -----------------------------

  const validatePassword = (password) => {

    // Minimum 8 characters
    if (password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    // One uppercase
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }

    // One lowercase
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }

    // One number
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }

    // One special character
    if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/';`~+=]/.test(password)) {
      return "Password must contain at least one special character.";
    }

    return "";
  };


  // -----------------------------
  // STEP 1 - LOGIN
  // -----------------------------

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    // Validate password
    const passwordError =
      validatePassword(password);

    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

  try {

  console.log(
    "Frontend email:",
    JSON.stringify(email)
  );

  console.log(
    "Frontend password:",
    JSON.stringify(password)
  );

  const data =
    await login(email, password);

  console.log(
    "Login response:",
    data
  );

  if (data?.otpRequired) {

    setOtpStep(true);

    setSuccess(
      "OTP has been sent to your registered email."
    );

    return;
  }

  if (!data || !data.user) {

    throw new Error(
      "Invalid login response from server."
    );
  }

  navigateByRole(data.user);

}catch (err) {

      console.error(
        "Full Login Error:",
        err
      );

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message;

      setError(
        typeof backendMessage === "string"
          ? backendMessage
          : "Invalid email or password."
      );

    } finally {

      setLoading(false);
    }
  };


  // -----------------------------
  // STEP 2 - VERIFY OTP
  // -----------------------------

  const handleOtpSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (otp.length !== 6) {

      setError(
        "Please enter the 6-digit OTP."
      );

      return;
    }

    setLoading(true);

    try {

      const data =
        await verifyOtp(email, otp);

      console.log(
        "OTP verification response:",
        data
      );

      if (!data || !data.user) {

        throw new Error(
          "Invalid OTP verification response."
        );
      }

      setSuccess(
        "OTP verified successfully!"
      );

      navigateByRole(data.user);

    } catch (err) {

      console.error(
        "OTP Error:",
        err
      );

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message;

      setError(
        typeof backendMessage === "string"
          ? backendMessage
          : "Invalid or expired OTP."
      );

    } finally {

      setLoading(false);
    }
  };


  // -----------------------------
  // ROLE NAVIGATION
  // -----------------------------

  const navigateByRole = (user) => {

    const userRole = String(user.role)
      .replace("ROLE_", "")
      .toLowerCase();

    console.log(
      "User role:",
      userRole
    );

    if (userRole === "donor") {

      navigate(
        "/donor/dashboard",
        { replace: true }
      );

    } else if (userRole === "patient") {

      navigate(
        "/patient/dashboard",
        { replace: true }
      );

    } else if (userRole === "admin") {

      navigate(
        "/admin/dashboard",
        { replace: true }
      );

    } else {

      setError(
        `Unrecognized user role: ${user.role}`
      );
    }
  };


  return (

    <div className="auth-container">

      <div className="auth-card">

        <h1>🩸 BloodConnect</h1>

        {!otpStep ? (

          <>
            <h2>Welcome Back</h2>

            <p>
              Login to your account
            </p>

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

              {/* EMAIL */}

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


              {/* PASSWORD */}

              <label>Password</label>

              <div className="password-wrapper">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>


              {/* PASSWORD REQUIREMENTS */}

              <div className="password-requirements">

                <small>
                  Password must contain:
                </small>

                <small>
                  • At least 8 characters
                </small>

                <small>
                  • One uppercase letter
                </small>

                <small>
                  • One lowercase letter
                </small>

                <small>
                  • One number
                </small>

                <small>
                  • One special character
                </small>

              </div>


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="primary-btn"
                disabled={loading}
              >
                {loading
                  ? "Sending OTP..."
                  : "Login"}
              </button>

            </form>

            <p className="auth-link">

              Don't have an account?{" "}

              <Link to="/signup">
                Create Account
              </Link>

            </p>

          </>

        ) : (

          // =====================================
          // OTP SCREEN
          // =====================================

          <>

            <h2>Verify Your Email</h2>

            <p>
              We sent a 6-digit OTP to
            </p>

            <strong className="otp-email">
              {email}
            </strong>

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

            <form onSubmit={handleOtpSubmit}>

              <label>Enter OTP</label>

              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                required
              />

              <button
                type="submit"
                className="primary-btn"
                disabled={loading}
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>

            </form>

            <button
              type="button"
              className="back-login-btn"
              onClick={() => {

                setOtpStep(false);
                setOtp("");
                setError("");
                setSuccess("");

              }}
            >
              ← Back to Login
            </button>

          </>

        )}

      </div>

    </div>
  );
};

export default Login;