import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type RoleRouteProps = {
  children: React.ReactNode;
  allowedRole: "doctor" | "admin";
};

export default function RoleRoute({
  children,
  allowedRole,
}: RoleRouteProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <p>Checking permissions...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}