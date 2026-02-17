import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/connexionU" />; // redirige si pas connecté
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // accès interdit
  }

  return children;
};

export default PrivateRoute;
