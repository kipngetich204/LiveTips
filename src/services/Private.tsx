import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean; // Only admins
}

export const PrivateRoute = ({
  children,
  requireAdmin = false,
}: PrivateRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    // Not logged in
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    // Logged in but not admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
