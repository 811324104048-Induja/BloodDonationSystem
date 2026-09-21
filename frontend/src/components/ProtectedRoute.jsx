import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Wait until authentication state is loaded
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // No logged-in user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Normalize role
  const userRole = String(user.role)
    .replace("ROLE_", "")
    .toLowerCase();

  console.log("ProtectedRoute user:", user);
  console.log("ProtectedRoute role:", userRole);
  console.log("Allowed roles:", allowedRoles);

  // Check role
  if (
    allowedRoles &&
    !allowedRoles
      .map((role) => String(role).toLowerCase())
      .includes(userRole)
  ) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;