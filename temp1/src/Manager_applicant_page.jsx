import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "./api";
const ApplicationDetailsPage = () => {
  const { loanType, id } = useParams();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const response = await api.get(`/api/applications/${loanType}/${id}`);
        console.log(response.data.application);
        setApplication(response.data.application);
      } catch (error) {
        console.error("Error fetching application details:", error);
      }
    };

    fetchApplicationDetails();
  }, [id, loanType]);

  const fetchDocument = async (documentName) => {
    try {
      console.log(documentName);
      const response = await api.get(`/api/doc/${documentName}`, {
        responseType: "blob", // Set response type to blob for binary data
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url); // Open PDF in a new tab
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };
  if (!application) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Application Details</h1>
      <div>
        <h2>Applicant Information</h2>
        <p>Name: {application.first_name}</p>
        <p>Email: {application.email}</p>
        <p>Phone Number: {application.phone_number}</p>
      </div>
      <div>
        <h2>Loan Details</h2>
        <p>Type: {application.loanType}</p>
        <p>Amount: {application.loan_amount}</p>
      </div>
      <div>
        <h2>Documents</h2>
        {loanType === "Car Loan" && (
          <ul>
            <li>
              <button onClick={() => fetchDocument(application.car_documents)}>
                View Document
              </button>
            </li>
          </ul>
        )}

        {loanType === "Home Loan" && (
          <ul>
            <li>
              <button
                onClick={() => fetchDocument(application.property_documents)}
              >
                View Document
              </button>
            </li>
          </ul>
        )}
        {loanType === "Personal Loan" && (
          <ul>
            <li>
              <button onClick={() => fetchDocument(application.income_proof)}>
                View Document
              </button>
            </li>
            <li>
              <button onClick={() => fetchDocument(application.address_proof)}>
                View Document
              </button>
            </li>
            <li>
              <button onClick={() => fetchDocument(application.identity_proof)}>
                View Document
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;
