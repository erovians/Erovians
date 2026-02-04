// src/components/ProtectedRoute.js
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import api from "./axios.utils";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/validate", {
          withCredentials: true,
        });

        if (res.data.valid) {
          setIsAuthenticated(true);
        } else {
          throw new Error("Invalid auth");
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
