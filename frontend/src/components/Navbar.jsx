import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  };

  return (
    <nav className="navbar">

      <div className="nav-left">

        <button
          className="menu-btn"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <div
          className="logo"
          onClick={() => navigate("/")}
        >
          🩸 BloodConnect
        </div>

      </div>

      <div className="nav-right">

        {user && (
          <>
            <span className="user-name">
              Hi, {user.name}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
};

export default Navbar;