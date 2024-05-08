import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
  state = {
    loggedIn: false,
  };

  render() {
    return (
      <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <Link to="/user" aria-current="page" className="navbar-brand">
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
                    to="/user-interface/account-details"
                    className="nav-link"
                    aria-current="page"
                  >
                    UserDetails
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/user-interface/apply-loan"
                    className="nav-link"
                    aria-current="page"
                  >
                    ApplyForLoan
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/user-interface/loan-status"
                    className="nav-link"
                    aria-current="page"
                  >
                    ApplicationStatus
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to="/user-interface/notifications"
                    className="nav-link"
                    aria-current="page"
                  >
                    Notifications
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

export default Navbar;
