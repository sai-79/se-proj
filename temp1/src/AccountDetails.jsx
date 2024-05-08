import React, { useState, useEffect } from "react";
import api from "./api";
import Navbar from "./navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AccountDetails.css";
function AccountDetails({ username }) {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    gender: "",
    nationality: "",
    maritalStatus: "",
    occupation: "",
    educationLevel: "",
    languageProficiency: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user_Id = localStorage.getItem("user_Id");
        const response = await api.get(`/api/user-details/${user_Id}`);
        setUserDetails(response.data);
        setFormData({
          fullName: response.data.fullName,
          address: response.data.address,
          city: response.data.city,
          state: response.data.state,
          postalCode: response.data.postalCode,
          dateOfBirth: response.data.dateOfBirth,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
          gender: response.data.gender,
          nationality: response.data.nationality,
          maritalStatus: response.data.maritalStatus,
          occupation: response.data.occupation,
          educationLevel: response.data.educationLevel,
          languageProficiency: response.data.languageProficiency,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Error fetching user details. Please try again later.");
        setLoading(false);
      }
    };

    if (username) {
      fetchUserDetails();
    }
  }, [username]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user_Id = localStorage.getItem("user_Id");
      console.log(formData);
      await api.put(`/api/user-details/${user_Id}`, formData);
      
      setUserDetails(formData); 
      console.log("User details updated successfully");
    } catch (error) {
      console.error("Error updating user details:", error);

    }
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="hcontainer mt-5">
        <h2>Account Details</h2>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {userDetails && (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label custom-label">Full Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label custom-label">Address:</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label custom-label">City:</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label custom-label">State:</label>
                <input
                  type="text"
                  className="form-control"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label custom-label">Postal Code:</label>
                <input
                  type="text"
                  className="form-control"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label custom-label">
                  Date of Birth:
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label custom-label">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label custom-label">Phone Number:</label>
                <input
                  type="text"
                  className="form-control"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label custom-label">Gender:</label>
                <input
                  type="text"
                  className="form-control"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label custom-label">Nationality:</label>
                <input
                  type="text"
                  className="form-control"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label custom-label">
                  Marital Status:
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label custom-label">Occupation:</label>
                <input
                  type="text"
                  className="form-control"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label custom-label">
                  Education Level:
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label custom-label">
                  Language Proficiency:
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="languageProficiency"
                  value={formData.languageProficiency}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export default AccountDetails;
