import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUserDataFromToken } from "../jwtUtils";
import "./topnav.css";
import { Link } from "react-router-dom";
import Dropdown from "../dropdown/Dropdown";
import ThemeMenu from "../thememenu/ThemeMenu";
import notifications from "../../assets/JsonData/notification.json";
import user_image from "../../assets/images/tuat.png";
import user_menu from "../../assets/JsonData/user_menus.json";

const Topnav = () => {
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const { username } = getUserDataFromToken(token);
        console.log("Username from token:", username);

        if (username === "Guest") {
          console.error("No valid username found in token");
          return;
        }

        const response = await axios.get(
          `http://localhost:8085/api/employers/user/${username}`
        );

        console.log("API Response:", response.data);
        const userData = response.data;

        setCurrUser({
          display_name: userData.name || "User",
          image: userData.url || user_image,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const renderNotificationItem = (item, index) => (
    <div className="notification-item" key={index}>
      <i className={item.icon}></i>
      <span>{item.content}</span>
    </div>
  );

  const renderUserToggle = (user) =>
    user ? (
      <div className="topnav__right-user">
        <div className="topnav__right-user__image">
          <img src={user.image} alt="User" />
        </div>
        <div className="topnav__right-user__name">{user.display_name}</div>
      </div>
    ) : (
      <div className="topnav__right-user">
        <div className="topnav__right-user__image">
          <img src={user_image} alt="Default User" />
        </div>
        <div className="topnav__right-user__name">User</div>
      </div>
    );

  const renderUserMenu = (item, index) => (
    <Link to="/" key={index}>
      <div className="notification-item">
        <i className={item.icon}></i>
        <span>{item.content}</span>
      </div>
    </Link>
  );

  return (
    <div className="topnav">
      <div></div>
      <div className="topnav__right">
        <div className="topnav__right-item">
          <Dropdown
            customToggle={() => renderUserToggle(currUser)}
            contentData={user_menu}
            renderItems={(item, index) => renderUserMenu(item, index)}
          />
        </div>
        <div className="topnav__right-item">
          <Dropdown
            icon="bx bx-bell"
            badge="12"
            contentData={notifications}
            renderItems={(item, index) => renderNotificationItem(item, index)}
            renderFooter={() => <Link to="/">View All</Link>}
          />
        </div>
        <div className="topnav__right-item">
          <ThemeMenu />
        </div>
      </div>
    </div>
  );
};

export default Topnav;
