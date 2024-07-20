import React, { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ThemeAction from "../../redux/actions/ThemeAction";
import Sidebar from "../sidebar/Sidebar";
import TopNav from "../topnav/TopNav";
import AppRoutes from "../AppRoutes";
import "./layout.css";

const Layout = () => {
  const themeReducer = useSelector((state) => state.ThemeReducer);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const themeClass = localStorage.getItem("themeMode") || "theme-mode-light";
    const colorClass = localStorage.getItem("colorMode") || "theme-mode-light";

    dispatch(ThemeAction.setMode(themeClass));
    dispatch(ThemeAction.setColor(colorClass));
  }, [dispatch]);

  const isAuthRoute = ["/login", "/register"].includes(location.pathname);

  return (
    <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
      {!isAuthRoute && <Sidebar />}
      <div className="layout__content">
        {!isAuthRoute && <TopNav />}
        <div className="layout__content-main">
          <AppRoutes />
        </div>
      </div>
    </div>
  );
};

const LayoutWrapper = () => (
  <BrowserRouter>
    <Layout />
  </BrowserRouter>
);

export default LayoutWrapper;
