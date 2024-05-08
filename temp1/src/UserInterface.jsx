import React from "react";
import "./UserInterface.css";
import Navbar from "./navbar.jsx";

function UserInterface() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <header>
        <h1>Welcome to Our Bank</h1>
      </header>
      <section className="bank-details">
        <h2>About Our Bank</h2>
        <p>
          Welcome to our bank, where we are committed to providing excellent
          financial services to our customers. With a focus on customer
          satisfaction, we strive to meet your banking needs with efficiency and
          reliability.
        </p>
      </section>
      <section className="loan-application">
        <h2>Apply for a Loan</h2>
        <p>
          Applying for a loan at our bank is simple and hassle-free. Whether you
          need financing for a new car, a personal expense, or your dream home,
          we have a loan solution for you.
        </p>
        <p>
          To apply for a loan, please visit one of our branches and speak with
          one of our friendly loan officers. They will guide you through the
          application process and assist you in selecting the loan that best
          fits your needs.
        </p>
      </section>
      <section className="interest-rates">
        <h2>Interest Rates</h2>
        <p>
          Below are the current interest rates for our various loan products:
        </p>
        <table>
          <thead>
            <tr>
              <th>Loan Type</th>
              <th>Interest Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Car Loan</td>
              <td>3.5%</td>
            </tr>
            <tr>
              <td>Personal Loan</td>
              <td>4.2%</td>
            </tr>
            <tr>
              <td>Home Loan</td>
              <td>4.8%</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="how-to-apply">
        <h2>How to Apply</h2>
        <p>To apply for a loan, follow these simple steps:</p>
        <ol>
          <li>Visit one of our bank branches.</li>
          <li>Speak with a loan officer.</li>
          <li>Complete the loan application form.</li>
          <li>
            Provide the necessary documentation, including proof of income and
            identification.
          </li>
          <li>Wait for approval.</li>
        </ol>
        <p>
          Once your loan application is approved, you will be notified, and the
          funds will be disbursed to you.
        </p>
      </section>
      <footer>
        <p>
          This website has a notifications feature and customers can also view
          the status of their loan applications.
        </p>
      </footer>
    </div>
  );
}

export default UserInterface;
