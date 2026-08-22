import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <aside className="sidebar">

      <h3>Menu</h3>

      {user.role === "donor" && (
        <>
          <NavLink to="/donor/dashboard">
            🏠 Dashboard
          </NavLink>

          <NavLink to="/donor/profile">
            👤 Profile
          </NavLink>

          <NavLink to="/donor/matches">
            🩸 Matched Requests
          </NavLink>

          <NavLink to="/donor/history">
            📋 Donation History
          </NavLink>
        </>
      )}

      {user.role === "patient" && (
        <>
          <NavLink to="/patient/dashboard">
            🏠 Dashboard
          </NavLink>

          <NavLink to="/patient/create-request">
            ➕ Blood Request
          </NavLink>

          <NavLink to="/patient/requests">
            📋 My Requests
          </NavLink>
        </>
      )}

      {user.role === "admin" && (
        <>
          <NavLink to="/admin/dashboard">
            🏠 Dashboard
          </NavLink>

          <NavLink to="/admin/users">
            👥 Users
          </NavLink>

          <NavLink to="/admin/donors">
            🩸 Donors
          </NavLink>

          <NavLink to="/admin/requests">
            📋 Requests
          </NavLink>

          <NavLink to="/admin/audit-logs">
            🔐 Audit Logs
          </NavLink>
        </>
      )}

    </aside>
  );
};

export default Sidebar;