import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  // 1. If no token or user data exists, kick them to login
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  // 2. If the route requires specific roles, and the user doesn't have it, kick them out
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect citizens trying to access officer pages
    if (user.role === "citizen") {
      return <Navigate to="/citizen-dashboard" replace />;
    }
    // Redirect officers trying to access citizen pages
    if (user.role === "officer" || user.role === "admin") {
      return <Navigate to="/officer" replace />;
    }
    if (user.role === "worker") {
      return <Navigate to="/worker-dashboard" replace />;
    }
    
    // Fallback
    return <Navigate to="/" replace />;
  }

  // 3. If they pass all checks, let them render the component
  return children;
};

export default ProtectedRoute;