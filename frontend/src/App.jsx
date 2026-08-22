import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import DonorDashboard from "./pages/donor/DonorDashboard";
import DonorProfile from "./pages/donor/DonorProfile";
import EditDonorProfile from "./pages/donor/EditDonorProfile";
import DonationHistory from "./pages/donor/DonationHistory";
import MatchedRequests from "./pages/donor/MatchedRequests";

import PatientDashboard from "./pages/patient/PatientDashboard";
import CreateRequest from "./pages/patient/CreateRequest";
import MyRequests from "./pages/patient/MyRequests";
import RequestDetails from "./pages/patient/RequestDetails";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageDonors from "./pages/admin/ManageDonors";
import ManageRequests from "./pages/admin/ManageRequests";
import AuditLogs from "./pages/admin/AuditLogs";

import "./App.css";

function App() {
  return (
    <AuthProvider>

      <BrowserRouter>

        <Routes>

          {/* PUBLIC */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          {/* DONOR */}

          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["donor"]}
              >
                <DonorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/donor/profile"
            element={
              <ProtectedRoute
                allowedRoles={["donor"]}
              >
                <DonorProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/donor/profile/edit"
            element={
              <ProtectedRoute
                allowedRoles={["donor"]}
              >
                <EditDonorProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/donor/history"
            element={
              <ProtectedRoute
                allowedRoles={["donor"]}
              >
                <DonationHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/donor/matches"
            element={
              <ProtectedRoute
                allowedRoles={["donor"]}
              >
                <MatchedRequests />
              </ProtectedRoute>
            }
          />

          {/* PATIENT */}

          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["patient"]}
              >
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/create-request"
            element={
              <ProtectedRoute
                allowedRoles={["patient"]}
              >
                <CreateRequest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/requests"
            element={
              <ProtectedRoute
                allowedRoles={["patient"]}
              >
                <MyRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/requests/:id"
            element={
              <ProtectedRoute
                allowedRoles={["patient"]}
              >
                <RequestDetails />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/donors"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <ManageDonors />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <ManageRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <AuditLogs />
              </ProtectedRoute>
            }
          />

          {/* DEFAULT */}

          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;