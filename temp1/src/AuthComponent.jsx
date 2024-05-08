// AuthComponent.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import "./AuthComponent.css"; // Import CSS file

const AuthComponent = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");

  const handleLogin = async () => {
    try {
      const response = await api.post("/api/login", {
        username,
        password,
        role,
      });

      if (response.status === 200) {
        const { user_Id } = response.data;
        localStorage.setItem("user_Id", user_Id);
        localStorage.setItem("username", username);
        if (role === "User") {
          navigate("/user");
        } else {
          navigate("/manager");
        }
      } else {
        console.error("Login failed. Unexpected response:", response);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="body">
      <div className="login-container">
        <div className="container bank-theme">
          <h2 className="login-heading">Login</h2>
          <div className="input-container">
            <label className="input-label">Username:</label>
            <input
              className="bank-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-container">
            <label className="input-label">Password:</label>
            <input
              className="bank-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-container">
            <label className="input-label">Role:</label>
            <select
              className="bank-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
