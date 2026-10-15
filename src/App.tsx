import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Patient from "./pages/Patient";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

import { AuthProvider, useAuth } from "./context/AuthContext";
import RoleRoute from "./components/RoleRoutes";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, role } = useAuth();

  if (loading) {
    return <p>Checking login...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // A signed-in user without a valid role cannot access the dashboard.
  if (!role) {
    return <p>No valid role assigned. Please contact the administrator.</p>;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/:id"
        element={
          <ProtectedRoute>
            <Patient />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <RoleRoute allowedRole="admin">
            <Admin />
          </RoleRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}