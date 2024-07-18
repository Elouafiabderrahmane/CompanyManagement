import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Materials from "../pages/Materials";
import Tasks from "../pages/Tasks";
import Payments from "../pages/Payments";
import Salaries from "../pages/Salaries";
import Projects from "../pages/Projects";
import Project from "../pages/Project";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/materials" element={<Materials />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/salaries" element={<Salaries />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/project/:id" element={<Project />} />
    </Routes>
  );
};

export default AppRoutes;
