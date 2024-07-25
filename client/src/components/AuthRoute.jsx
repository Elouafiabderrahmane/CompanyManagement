// components/AuthRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated } = useSelector((state) => state.UserReducer);

  console.log("AuthRoute check:", isAuthenticated); // Debugging line

  return isAuthenticated ? Component : <Navigate to="/login" />;
};

export default AuthRoute;
