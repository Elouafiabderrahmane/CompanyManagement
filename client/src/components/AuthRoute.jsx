import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRoute = ({ element: Component }) => {
  const { isAuthenticated } = useSelector((state) => state.UserReducer);
  console.log("AuthRoute PrivateRoute: isAuthenticated =", isAuthenticated);
  return isAuthenticated ? Component : <Navigate to="/login" />;
};

export default AuthRoute;
