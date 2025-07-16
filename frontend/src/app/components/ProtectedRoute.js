import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  localStorage.setItem("token", token);
  return token ? children : <Navigate to="/pages/dashboard" />;
};

export default ProtectedRoute;
