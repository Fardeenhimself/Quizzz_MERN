import { Navigate } from "react-router-dom";

function PrivateRoute({ element, isAuthenticated }) {
  return isAuthenticated ? element : <Navigate to="/login" />;
}

export default PrivateRoute;
