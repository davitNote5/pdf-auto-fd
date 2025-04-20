import { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";  // adjust path if needed

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (!storedLogin) {
      window.location.href = "/"; // ⛔️ Force redirect if not logged in
    }
  }, [location.pathname]);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;