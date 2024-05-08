import React, { Component } from "react";
import { Link } from "react-router-dom";

class MNavbar extends Component {
  state = {
    loggedIn: false,
  };

  render() {
    return (
      <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <Link to="/manager" aria-current="page" className="navbar-brand">
              Navbar
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link
                    to="/manager_dashboard"
                    className="nav-link"
                    aria-current="page"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="" className="nav-link" aria-current="page">
                    Comunication
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </>
    );
  }
}

export default MNavbar;
