import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
// import "./RegistrationComponent.css"; // Import CSS file

const RegistrationComponent = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState(""); // New state for account type

  const handleRegistration = async () => {
    try {
      const response = await api.post("/api/register", {
        username,
        email,
        password,
        accountType, // Include accountType in the request
      });

      if (response.status === 200) {
        const { user_Id } = response.data;
        // Set a value in localStorage
        localStorage.setItem("user_Id", user_Id);

        // Registration successful, navigate to appropriate page
        navigate("/personaldetails"); // Redirect to personal details page after registration
      } else {
        console.error("Registration failed. Unexpected response:", response);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="body">
      <div className="registration-container">
        <div className="container bank-theme">
          <h2 className="registration-heading">Register</h2>
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
            <label className="input-label">Email:</label>
            <input
              className="bank-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <label className="input-label">Account Type:</label>
            <select
              className="bank-input"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              <option value="">Select Account Type</option>
              <option value="savings">Savings</option>
              <option value="current">Current</option>
            </select>
          </div>
          <button className="registration-button" onClick={handleRegistration}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationComponent;
