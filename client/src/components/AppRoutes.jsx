// components/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Materials from "../pages/Materials";
import Tasks from "../pages/Tasks";
import Payments from "../pages/Payments";
import Salaries from "../pages/Salaries";
import Projects from "../pages/Projects";
import Project from "../pages/Project";
import Employers from "../pages/Employers";
import EmployerDetails from "../pages/EmployerDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthRoute element={<Dashboard />} />} />
      <Route
        path="/dashboard"
        element={<AuthRoute element={<Dashboard />} />}
      />
      <Route
        path="/customers"
        element={<AuthRoute element={<Customers />} />}
      />
      <Route
        path="/materials"
        element={<AuthRoute element={<Materials />} />}
      />
      <Route path="/tasks" element={<AuthRoute element={<Tasks />} />} />
      <Route path="/payments" element={<AuthRoute element={<Payments />} />} />
      <Route path="/salaries" element={<AuthRoute element={<Salaries />} />} />
      <Route path="/projects" element={<AuthRoute element={<Projects />} />} />
      <Route
        path="/project/:id"
        element={<AuthRoute element={<Project />} />}
      />
      <Route
        path="/employers"
        element={<AuthRoute element={<Employers />} />}
      />
      <Route
        path="/employers/:id"
        element={<AuthRoute element={<EmployerDetails />} />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
