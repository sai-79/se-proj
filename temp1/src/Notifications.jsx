import React, { useState, useEffect } from "react";
import api from "./api";
import Navbar from "./navbar";
import "./notifications.css";
function Notifications({ username }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/notifications/${username}`);
        console.log("fqh");
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching notifications");
        setLoading(false);
      }
    };

    // Fetch notifications when the component mounts
    fetchNotifications();
  }, [username]);

  return (
    <>
      <div className="navbar-container">
        <Navbar />
      </div>
      <div className="notifications-container">
        <h2>Notifications</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <ul className="log-list">
            {notifications.map((notification, index) => (
              <li
                key={notification.id}
                className={index % 2 === 0 ? "log-entry even" : "log-entry odd"}
              >
                {notification.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default Notifications;
