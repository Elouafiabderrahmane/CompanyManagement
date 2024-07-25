import React, { useState, useEffect } from "react";
import axios from "axios";
import "./topnav.css";
import { Link } from "react-router-dom";
import Dropdown from "../dropdown/Dropdown";
import ThemeMenu from "../thememenu/ThemeMenu";
import notifications from "../../assets/JsonData/notification.json";
import user_image from "../../assets/images/tuat.png"; // This can be removed if user image comes from API
import user_menu from "../../assets/JsonData/user_menus.json"; // Import user_menu


const Topnav = () => {
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8085/api/user"); // Update with your API endpoint
        const userData = response.data;
        setCurrUser({
          display_name: userData.name || "User", // Adjust based on API response
          image: userData.image || user_image, // Adjust based on API response
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Handle error as needed
      }
    };

    fetchUserData();
  }, []);

  if (!currUser) {
    return <div>Loading...</div>; // Or a spinner/loading indicator
  }

  const renderNotificationItem = (item, index) => (
    <div className="notification-item" key={index}>
      <i className={item.icon}></i>
      <span>{item.content}</span>
    </div>
  );

  const renderUserToggle = (user) => (
    <div className="topnav__right-user">
      <div className="topnav__right-user__image">
        <img src={user.image} alt="" />
      </div>
      <div className="topnav__right-user__name">{user.display_name}</div>
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
