import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {

    const toggleSidebar = () => {
      setIsOpen((previous) => !previous);
    };

    window.addEventListener(
      "toggle-sidebar",
      toggleSidebar
    );

    return () => {
      window.removeEventListener(
        "toggle-sidebar",
        toggleSidebar
      );
    };

  }, []);

  const closeSidebar = () => {
    setIsOpen(false);
  };

  if (!user) return null;

  const role = user.role?.toLowerCase();

  return (
    <>
      {/* Background overlay */}

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >

        <div className="sidebar-header">

          <h3>Menu</h3>

          <button
            className="sidebar-close-btn"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            ×
          </button>

        </div>


        {/* DONOR */}

        {role === "donor" && (
          <>
            <NavLink
              to="/donor/dashboard"
              onClick={closeSidebar}
            >
              🏠 Dashboard
            </NavLink>

            <NavLink
              to="/donor/profile"
              onClick={closeSidebar}
            >
              👤 Profile
            </NavLink>

            <NavLink
              to="/donor/matches"
              onClick={closeSidebar}
            >
              🩸 Matched Requests
            </NavLink>

            <NavLink
              to="/donor/history"
              onClick={closeSidebar}
            >
              📋 Donation History
            </NavLink>
          </>
        )}


        {/* PATIENT */}

       {role === "patient" && (
  <>
    <NavLink
      to="/patient/dashboard"
      onClick={closeSidebar}
    >
      🏠 Dashboard
    </NavLink>

    <NavLink
      to="/patient/profile"
      onClick={closeSidebar}
    >
      👤 My Profile
    </NavLink>

    <NavLink
      to="/patient/create-request"
      onClick={closeSidebar}
    >
      ➕ Blood Request
    </NavLink>

    <NavLink
      to="/patient/requests"
      onClick={closeSidebar}
    >
      📋 My Requests
    </NavLink>
  </>
)}


        {/* ADMIN */}

        {role === "admin" && (
          <>
            <NavLink
              to="/admin/dashboard"
              onClick={closeSidebar}
            >
              🏠 Dashboard
            </NavLink>

            <NavLink
              to="/admin/users"
              onClick={closeSidebar}
            >
              👥 Users
            </NavLink>

            <NavLink
              to="/admin/donors"
              onClick={closeSidebar}
            >
              🩸 Donors
            </NavLink>

            <NavLink
              to="/admin/requests"
              onClick={closeSidebar}
            >
              📋 Requests
            </NavLink>

            <NavLink
              to="/admin/audit-logs"
              onClick={closeSidebar}
            >
              🔐 Audit Logs
            </NavLink>
          </>
        )}

      </aside>
    </>
  );
};

export default Sidebar;