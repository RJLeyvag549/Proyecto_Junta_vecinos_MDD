import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const userRole = storedUser?.data?.role; // 👈 debe ser .data.role

  const isAuthenticated = !!storedUser;
  const isAuthorized = allowedRoles ? allowedRoles.includes(userRole) : true;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAuthorized) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRoute;
