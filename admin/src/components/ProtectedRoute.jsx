import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// ── Generic Protected Route ───────────────────────────────
export function ProtectedRoute({ children }) {
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// ── Super Admin Only ───────────────────────────────
export function SuperAdminRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return null;

  if (!user || !user.role?.includes("super_admin")) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// ── Permission Route ───────────────────────────────
export function PermissionRoute({ children, permKey }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return null;

  // ✅ super admin ko sab access
  if (user?.role?.includes("super_admin")) {
    return children;
  }

  // ✅ normal permission check
  if (!user?.adminPermissions?.includes(permKey)) {
    return <Navigate to="/" replace />;
  }

  return children;
}


