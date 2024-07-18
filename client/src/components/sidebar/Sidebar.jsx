import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import logo from "../../assets/images/logo2.png";
import sidebar_items from "../../assets/JsonData/sidebar_routes.json";

const SidebarItem = ({ icon, title, active }) => {
  return (
    <div className={`sidebar__item ${active ? "active" : ""}`}>
      <div className="sidebar__item-inner">
        <i className={icon}></i>
        <span>{title}</span>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const activeItem = sidebar_items.findIndex(
    (item) => item.route === location.pathname
  );

  return (
    <div className="sidebar">
      <div
        className="sidebar__logo"
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={logo}
          alt="company logo"
          style={{ width: "150px", height: "80px", borderRadius: "10%" }}
        />
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "24px",
            fontWeight: "bold",
            marginTop: "10px",
            marginBottom: "20px",
          }}
        >
          BARAKATOUNA
        </div>
      </div>

      {sidebar_items.map((item, index) => (
        <Link to={item.route} key={index} style={{ textDecoration: "none" }}>
          <SidebarItem
            title={item.display_name}
            icon={item.icon}
            active={index === activeItem}
          />
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
