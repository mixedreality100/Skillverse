// components/ProtectedRoute.jsx
import { useLocation, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  return location.state?.fromApp ? children : <Navigate to="/404" replace />;
};

export default ProtectedRoute;