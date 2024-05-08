import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
const LandingPage = () => {
  return (
    <div className="hcontainer">
      <div className="landing-page text-center py-5">
        <h1 className="mb-4">Welcome!</h1>
        <p className="lead mb-4">Please select an option:</p>
        <div className="options d-flex justify-content-center">
          <Link to="/login" className="login-link mx-2">
            <button className="btn btn-primary">Login</button>
          </Link>
          <Link to="/register" className="register-link mx-2">
            <button className="btn btn-secondary">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
