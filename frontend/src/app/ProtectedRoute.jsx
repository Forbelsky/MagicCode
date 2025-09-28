// src/app/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useUserContext } from "./UserProvider.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useUserContext();

  if (loading) {
    return <div>Načítám…</div>; // může být spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
