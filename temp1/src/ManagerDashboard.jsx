import React, { useState, useEffect } from "react";
import api from "./api";
import { Link } from "react-router-dom";
import MNavbar from "./manager_navbar";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/api/applications");
        setApplications(response.data.applications);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []); // Empty dependency array ensures the effect runs only once, when the component mounts

  const handleApprove = async (id, loanType) => {
    try {
      console.log("hi");
      await api.post(`/api/applications/${loanType}/${id}/approve`);
      // After successful approval, update the status locally
      console.log("after");
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.id === id
            ? { ...application, status: "Approved" }
            : application
        )
      );
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleReject = async (id, loanType) => {
    try {
      await api.post(`/api/applications/${loanType}/${id}/reject`);
      // After successful rejection, update the status locally
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.id === id
            ? { ...application, status: "Rejected" }
            : application
        )
      );
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  return (
    <div>
      <MNavbar />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Loan Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td>
                <Link
                  to={`/applications/${application.loanType}/${application.id}`}
                >
                  {application.first_name}
                </Link>
              </td>
              <td>{application.email}</td>
              <td>{application.phone_number}</td>
              <td>{application.loanType}</td>
              <td>{application.status}</td>
              <td>
                <button
                  onClick={() =>
                    handleApprove(application.id, application.loanType)
                  }
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    handleReject(application.id, application.loanType)
                  }
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
