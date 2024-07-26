import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute"; // Adjust the path as needed

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Customers = lazy(() => import("../pages/Customers"));
const Materials = lazy(() => import("../pages/Materials"));
const Tasks = lazy(() => import("../pages/Tasks"));
const Payments = lazy(() => import("../pages/Payments"));
const Salaries = lazy(() => import("../pages/Salaries"));
const Projects = lazy(() => import("../pages/Projects"));
const Project = lazy(() => import("../pages/Project"));
const Employers = lazy(() => import("../pages/Employers"));
const EmployerDetails = lazy(() => import("../pages/EmployerDetails"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Unauthorized = lazy(() => import("../pages/Unauthorized")); // Add an Unauthorized page if needed

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/salaries" element={<Salaries />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<Project />} />
          <Route path="/employers" element={<Employers />} />
          <Route path="/employers/:id" element={<EmployerDetails />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
