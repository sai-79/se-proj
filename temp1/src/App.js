// // App.js
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import AccountDetails from "./AccountDetails";
// import LoanApplication from "./LoanApplication";
// import LoanStatus from "./LoanStatus";
// import Notifications from "./Notifications";
// import AuthComponent from "./AuthComponent";
// import UserInterface from "./UserInterface";
// import ManagerInterface from "./ManagerInterface";
// import "./AuthComponent.css";
// const App = () => {
//   const username = localStorage.getItem("username");
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<AuthComponent />} />
//         <Route path="/user" element={<UserInterface />} />
//         <Route path="/manager" element={<ManagerInterface />} />
//         <Route
//           exact
//           path="/user-interface/account-details"
//           element={<AccountDetails username={username} />}
//         />
//         <Route
//           path="/user-interface/apply-loan"
//           element={<LoanApplication />}
//         />
//         <Route path="/user-interface/loan-status" element={<LoanStatus />} />
//         <Route
//           path="/user-interface/notifications"
//           element={<Notifications />}
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AccountDetails from "./AccountDetails";
import LoanApplication from "./LoanApplication";
import LoanStatus from "./LoanStatus";
import Notifications from "./Notifications";
import AuthComponent from "./AuthComponent";
import UserInterface from "./UserInterface";
import ManagerInterface from "./ManagerInterface";
import "./AuthComponent.css";
import RegistrationComponent from "./RegistrationPage.jsx";
import LandingPage from "./LandingPage.jsx";
import PersonalDetailsComponent from "./PersonalDetails.jsx";
import ApplicationDetailsPage from "./Manager_applicant_page.jsx";
import Dashboard from "./ManagerDashboard.jsx";
const App = () => {
  const username = localStorage.getItem("username");
  const isLoggedIn = !!username;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthComponent />} />
        <Route path="/register" element={<RegistrationComponent />} />
        <Route path="/manager_dashboard" element={<Dashboard />} />
        <Route
          path="/applications/:loanType/:id"
          element={<ApplicationDetailsPage />}
        />
        <Route path="/personaldetails" element={<PersonalDetailsComponent />} />
        {isLoggedIn && (
          <>
            <Route path="/user" element={<UserInterface />} />
            <Route path="/manager" element={<ManagerInterface />} />
            <Route
              exact
              path="/user-interface/account-details"
              element={<AccountDetails username={username} />}
            />
            <Route
              path="/user-interface/apply-loan"
              element={<LoanApplication username={username} />}
            />
            <Route
              path="/user-interface/loan-status"
              element={<LoanStatus username={username} />}
            />
            <Route
              path="/user-interface/notifications"
              element={<Notifications username={username} />}
            />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
