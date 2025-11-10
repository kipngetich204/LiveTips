import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export function AdminRoute({ children }: Props) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? <>{children}</> : <Navigate to="/login" replace />;
}
