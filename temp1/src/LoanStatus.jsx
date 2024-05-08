import React, { useState, useEffect, useCallback } from "react";
import api from "./api";
import Navbar from "./navbar";
import "./loanStatus.css";

function LoanStatus() {
  const [loanApplications, setLoanApplications] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const user_Id = localStorage.getItem("user_Id");
      const response = await api.get(`/api/loan-status/${user_Id}`);
      const { rows, percentageReviewedList } = response.data;

      const applicationsWithDetails = rows.map((row, index) => ({
        id: row.id,
        status: row.status, // Assuming status is included in row
        percentageReviewed: percentageReviewedList[index], // Assuming percentageReviewedList is ordered accordingly
        details: row, // Assuming row contains all the necessary details
      }));
      console.log(response.data);
      setLoanApplications(applicationsWithDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Navbar />
      <div className="loan-status-container d-flex justify-content-center costum-label">
        <div className="container">
          <h2 className="heading custom-label text-center mb-4">Loan Status</h2>
          {loanApplications.map((application, index) => (
            <div
              className={`application-container card mb-3 ${
                application.status === "Approved"
                  ? "approved"
                  : application.status === "Rejected"
                  ? "rejected"
                  : ""
              }`}
              key={index}
            >
              <h3 className="application-index card-header">
                Application {index + 1}
              </h3>
              <div className="card-body">
                <p className="application-status card-text">
                  Status: {application.status}
                </p>
                <div className="progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${application.percentageReviewed}%` }}
                  />
                </div>
                <div>
                  <h4 className="details-heading mt-3">Application Details</h4>
                  <ul className="details-list list-group">
                    <li className="list-group-item">
                      First Name: {application.details.first_name}
                    </li>
                    <li className="list-group-item">
                      Last Name: {application.details.last_name}
                    </li>
                    <li className="list-group-item">
                      Loan Type: {application.details.loanType}
                    </li>
                    <li className="list-group-item">
                      Loan Amount: {application.details.loan_amount}
                    </li>
                    <li className="list-group-item">
                      Email: {application.details.email}
                    </li>
                    <li className="list-group-item">
                      Mobile Number: {application.details.phone_number}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default LoanStatus;
