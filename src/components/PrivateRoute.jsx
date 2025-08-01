import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const cookieExists = document.cookie.includes("access_token=");
    console.log("Checking authentication status:", cookieExists);
    
    setIsAuthenticated(cookieExists);
  }, []);

  if (isAuthenticated === null) {
    // Можна показати лоадер або порожній компонент поки чекаємо
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;