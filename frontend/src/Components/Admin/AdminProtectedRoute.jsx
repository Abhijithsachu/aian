import React from "react";
import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  // Not logged in
  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  // Logged in but not admin
  if (!user || user.isAdmin !== true) {
    return <Navigate to="/" replace />;
  }

  // Admin allowed
  return children;
}

export default AdminProtectedRoute;