// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./LoanApplication.css"; // Import CSS file for styling
// import api from "./api";
// import Navbar from "./navbar";
// import "./form.css";

// function LoanApplication(props) {
//   const [formData, setFormData] = useState({
//     loanType: "",
//     loanAmount: "",
//     monthlyIncome: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNumber: "",
//     aadharDocument: null,
//     panDocument: null,
//     otherDocuments: null,
//   });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: files ? files[0] : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formDataToSend = new FormData();
//       for (const key in formData) {
//         formDataToSend.append(key, formData[key]);
//       }
//       const response = await api.post(
//         `/api/apply-loan/${props.username}`,
//         formDataToSend,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       setMessage(response.data.message);
//       if (response.status === 200) {
//         // If response is successful, navigate to another page
//         navigate("/user");
//       }
//     } catch (error) {
//       console.error("Error applying for loan:", error);
//     }
//   };
//   return (
//     <>
//       <div>
//         <Navbar />
//       </div>
//       <div className="loan-application-container">
//         <h2 className="form-heading">Apply for Loan</h2>
//         <form className="loan-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label className="form-label custom-label">
//               Loan Type:
//               <select
//                 name="loanType"
//                 value={formData.loanType}
//                 onChange={handleChange}
//                 className="form-input"
//               >
//                 <option value="">Select Loan Type</option>
//                 <option value="Personal Loan">Personal Loan</option>
//                 <option value="Home Loan">Home Loan</option>
//                 <option value="Car Loan">Car Loan</option>
//                 {/* Add more options as needed */}
//               </select>
//             </label>
//           </div>
// <div className="form-group">
//   <label className="form-label">
//     Loan Amount ($):
//     <input
//       type="text"
//       name="loanAmount"
//       value={formData.loanAmount}
//       onChange={handleChange}
//       className="form-input"
//     />
//   </label>
// </div>
// <div className="form-group">
//   <label className="form-label">
//     Monthly Income ($):
//     <input
//       type="text"
//       name="monthlyIncome"
//       value={formData.monthlyIncome}
//       onChange={handleChange}
//       className="form-input"
//     />
//   </label>
// </div>
// <div className="form-group">
//   <label className="form-label">
//     First Name:
//     <input
//       type="text"
//       name="firstName"
//       value={formData.firstName}
//       onChange={handleChange}
//       className="form-input"
//     />
//   </label>
// </div>
// <div className="form-group">
//   <label className="form-label">
//     Last Name:
//     <input
//       type="text"
//       name="lastName"
//       value={formData.lastName}
//       onChange={handleChange}
//       className="form-input"
//     />
//   </label>
// </div>
// <div className="form-group">
//   <label className="form-label">
//     Email:
//     <input
//       type="email"
//       name="email"
//       value={formData.email}
//       onChange={handleChange}
//       className="form-input"
//     />
//   </label>
// </div>
// <div className="form-group">
//   <label className="form-label">
//     Phone Number:
//     <input
//       type="tel"
//       name="phoneNumber"
//       value={formData.phoneNumber}
//       onChange={handleChange}
//       className="form-input"
//     />
//   </label>
// </div>
//           <div className="form-group">
//             <label className="form-label">
//               Aadhar Document (PDF only):
//               <input
//                 type="file"
//                 name="aadharDocument"
//                 accept=".pdf"
//                 onChange={handleChange}
//                 className="form-input"
//               />
//             </label>
//           </div>
//           <div className="form-group">
//             <label className="form-label">
//               PAN Document (PDF only):
//               <input
//                 type="file"
//                 name="panDocument"
//                 accept=".pdf"
//                 onChange={handleChange}
//                 className="form-input"
//               />
//             </label>
//           </div>
//           <div className="form-group">
//             <label className="form-label">
//               Other Documents:
//               <input
//                 type="file"
//                 name="otherDocuments"
//                 onChange={handleChange}
//                 className="form-input"
//               />
//             </label>
//           </div>
//           <button type="submit" className="submit-button">
//             Apply
//           </button>
//         </form>
//         {message && <p className="message">{message}</p>}
//       </div>
//     </>
//   );
// }

// export default LoanApplication;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoanApplication.css"; // Import CSS file for styling
import api from "./api";
import Navbar from "./navbar";
import "./form.css";

function LoanApplication(props) {
  const [formData, setFormData] = useState({
    loanType: "",
    loanAmount: "",
    monthlyIncome: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    aadharDocument: null,
    panDocument: null,
    otherDocuments: null,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any of the mandatory document fields are empty
    if (
      formData.loanType === "Personal Loan" &&
      (!formData.incomeProof ||
        !formData.addressProof ||
        !formData.identityProof)
    ) {
      setMessage("Please upload all mandatory documents.");
      return;
    } else if (
      formData.loanType === "Home Loan" &&
      !formData.propertyDocuments
    ) {
      setMessage("Please upload property documents.");
      return;
    } else if (formData.loanType === "Car Loan" && !formData.carDocuments) {
      setMessage("Please upload car documents.");
      return;
    }

    try {
      const user_Id = localStorage.getItem("user_Id");
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      const response = await api.post(
        `/api/apply-loan/${user_Id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      if (response.status === 200) {
        // If response is successful, navigate to another page
        navigate("/user");
      }
    } catch (error) {
      console.error("Error applying for loan:", error);
    }
  };

  const handleLoanTypeChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      // Reset document fields when loan type changes
      aadharDocument: null,
      panDocument: null,
      otherDocuments: null,
    });
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="loan-application-container">
        <h2 className="form-heading">Apply for Loan</h2>
        <form className="loan-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label custom-label">
              Loan Type:
              <select
                name="loanType"
                value={formData.loanType}
                onChange={handleLoanTypeChange}
                className="form-input"
              >
                <option value="">Select Loan Type</option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="Home Loan">Home Loan</option>
                <option value="Car Loan">Car Loan</option>
                {/* Add more options as needed */}
              </select>
            </label>
          </div>
          {/* Depending on loan type, show relevant document fields */}
          {formData.loanType === "Personal Loan" && (
            <>
              <div className="form-group">
                <label className="form-label">
                  Income Proof (PDF only):
                  <input
                    type="file"
                    name="incomeProof"
                    accept=".pdf"
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Address Proof (PDF only):
                  <input
                    type="file"
                    name="addressProof"
                    accept=".pdf"
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Identity Proof (PDF only):
                  <input
                    type="file"
                    name="identityProof"
                    accept=".pdf"
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Loan Amount ($):
                  <input
                    type="text"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Monthly Income ($):
                  <input
                    type="text"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  First Name:
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Last Name:
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Phone Number:
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
            </>
          )}
          {formData.loanType === "Home Loan" && (
            <>
              <div className="form-group">
                <label className="form-label">
                  Property Documents (PDF only):
                  <input
                    type="file"
                    name="propertyDocuments"
                    accept=".pdf"
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Loan Amount ($):
                  <input
                    type="text"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Monthly Income ($):
                  <input
                    type="text"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  First Name:
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Last Name:
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Phone Number:
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
            </>
          )}
          {formData.loanType === "Car Loan" && (
            <>
              <div className="form-group">
                <label className="form-label">
                  Car Documents (PDF only):
                  <input
                    type="file"
                    name="carDocuments"
                    accept=".pdf"
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Loan Amount ($):
                  <input
                    type="text"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Monthly Income ($):
                  <input
                    type="text"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  First Name:
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Last Name:
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Phone Number:
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>
            </>
          )}
          {/* Other input fields */}
          <button type="submit" className="submit-button">
            Apply
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </>
  );
}

export default LoanApplication;
