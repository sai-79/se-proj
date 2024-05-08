import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

const PersonalDetailsComponent = () => {
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user_Id = localStorage.getItem("user_Id");

      const response = await api.post(
        "/api/personal_details",
        { user_Id, formData },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      localStorage.removeItem("user_Id");
      navigate("/login");
      console.log("Form data submitted successfully!");
    } catch (error) {
      console.error("Error submitting form data:", error);
      // Handle error
    }
  };

  return (
    <div className="hcontainer mt-5 row justify-content-center">
      <div className="">
        <h2 className="mb-4">Personal Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">
              Full Name:*
            </label>
            <input
              type="text"
              id="fullName"
              className="form-control"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Address:*
            </label>
            <textarea
              id="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              City:*
            </label>
            <input
              type="text"
              id="city"
              className="form-control"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="state" className="form-label">
              State:*
            </label>
            <input
              type="text"
              id="state"
              className="form-control"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="postalCode" className="form-label">
              Postal Code:*
            </label>
            <input
              type="text"
              id="postalCode"
              className="form-control"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dateOfBirth" className="form-label">
              Date of Birth:*
            </label>
            <input
              type="date"
              id="dateOfBirth"
              className="form-control"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email:*
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number:*
            </label>
            <input
              type="tel"
              id="phoneNumber"
              className="form-control"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">
              Gender:
            </label>
            <select
              id="gender"
              className="form-select"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="nationality" className="form-label">
              Nationality:*
            </label>
            <select
              id="nationality"
              className="form-select"
              value={formData.nationality}
              onChange={handleChange}
              required
            >
              <option value="">Select Nationality</option>
              <option value="american">American</option>
              <option value="british">British</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="maritalStatus" className="form-label">
              Marital Status:
            </label>
            <select
              id="maritalStatus"
              className="form-select"
              value={formData.maritalStatus}
              onChange={handleChange}
            >
              <option value="">Select Marital Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="occupation" className="form-label">
              Occupation:*
            </label>
            <input
              type="text"
              id="occupation"
              className="form-control"
              value={formData.occupation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="educationLevel" className="form-label">
              Education Level:
            </label>
            <input
              type="text"
              id="educationLevel"
              className="form-control"
              value={formData.educationLevel}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="languageProficiency" className="form-label">
              Language Proficiency:
            </label>
            <input
              type="text"
              id="languageProficiency"
              className="form-control"
              value={formData.languageProficiency}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalDetailsComponent;
