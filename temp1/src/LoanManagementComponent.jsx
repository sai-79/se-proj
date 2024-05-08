// LoanManagementComponent.js
import React, { useState } from "react";
import axios from "axios";

const LoanManagementComponent = () => {
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");

  const handleLoanApplication = async () => {
    try {
      const response = await axios.post("/api/applyLoan", {
        amount,
        interestRate,
      });
      console.log(response.data); // handle loan application success
    } catch (error) {
      console.error(error); // handle loan application error
    }
  };

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Loan Amount"
      />
      <input
        type="number"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
        placeholder="Interest Rate"
      />
      <button onClick={handleLoanApplication}>Apply for Loan</button>
    </div>
  );
};

export default LoanManagementComponent;
