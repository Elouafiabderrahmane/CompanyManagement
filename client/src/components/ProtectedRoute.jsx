import { Navigate, Outlet } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import { getUserDataFromToken } from "./jwtUtils";

const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.UserReducer);
  const token = localStorage.getItem("token");
  const { role } = getUserDataFromToken(token);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && role !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
