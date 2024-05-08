const jwt = require("jsonwebtoken");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");
const crypto = require("crypto");
const multer = require("multer");
const uuid = require("uuid");
const fs = require("fs");
const app = express();

app.use(bodyParser.json());
app.use(cors());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Saivenkat#1",
  database: "bank_loan_management_system",
});

app.get("/api/notifications/:username", async (req, res) => {
  try {
    const username = req.params.username; // Access the username from req.params

    const sql = `SELECT * FROM messages WHERE username = ?`;

    const [messages, fields] = await pool.query(sql, [username]); // Execute the query with await

    console.log("Messages retrieved successfully");
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Upload files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Add timestamp to file name to avoid duplicates
  },
});
const upload = multer({ storage: storage });

app.post("/api/apply-loan/:user_Id", upload.any(), async (req, res) => {
  try {
    const {
      loanType,
      loanAmount,
      monthlyIncome,
      firstName,
      lastName,
      email,
      phoneNumber,
    } = req.body;
    const { user_Id } = req.params;

    let tableName;
    let additionalFields = "";
    let additionalPlaceholders = "";
    let documents = [];

    if (loanType === "Personal Loan" || loanType === "personal loan") {
      tableName = "personal_loan_documents";
      additionalFields = " income_proof, address_proof, identity_proof";
      additionalPlaceholders = "?,?,?";
      documents = req.files.map((file) => file.path);
    } else if (loanType === "Home Loan" || loanType === "home loan") {
      tableName = "home_loan_documents";
      additionalFields = "property_documents";
      additionalPlaceholders = "?";
      documents = req.files.map((file) => file.path);
    } else if (loanType === "Car Loan") {
      tableName = "car_loan_documents";
      additionalFields = "car_documents";
      additionalPlaceholders = "?";
      // Handle single file upload for car_documents
      documents = req.files.length > 0 ? req.files[0].path : null;
    } else {
      throw new Error("Invalid loan type");
    }

    // Construct the query dynamically
    const query = `
      INSERT INTO ${tableName} (id,user_id, loan_amount, monthly_income, first_name, last_name, email, phone_number, ${additionalFields})
      VALUES (?, ?, ?, ?, ?, ?, ?,?, ${additionalPlaceholders})
    `;

    const loan_Id = uuid.v4();
    // Combine all values including the documents array
    const values = [
      loan_Id,

      user_Id,
      loanAmount,
      monthlyIncome,
      firstName,
      lastName,
      email,
      phoneNumber,
    ];

    // Push document paths to values array based on loan type
    if (Array.isArray(documents)) {
      values.push(...documents);
    } else {
      values.push(documents);
    }
    console.log(values);
    // Execute the query
    await pool.query(query, values);

    if (loanType === "Car Loan" || loanType === "car loan") {
      console.log("k");
      await pool.query(
        "INSERT INTO car_review (application_id, car_document_status) VALUES (?, ?)",
        [loan_Id, "underreview"]
      );
    } else if (loanType === "Home Loan" || loanType === "home loan") {
      console.log("kk");
      await pool.query(
        "INSERT INTO home_review (application_id, property_document_status) VALUES (?, ?)",
        [loan_Id, "underreview"]
      );
    } else {
      console.log("kkk");
      await pool.query(
        "INSERT INTO personal_review (application_id, income_document_status,address_document_status,identity_document_status) VALUES (?, ?,?,?)",
        [loan_Id, "underreview", "underreview", "underreview"]
      );
    }
    console.log("application stored successfully");
    res
      .status(200)
      .json({ message: "Loan application submitted successfully" });
  } catch (error) {
    console.error("Error applying for loan:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

async function saveLoanApplicationToDatabase(
  username,
  loanType,
  loanAmount,
  monthlyIncome,
  firstName,
  lastName,
  email,
  phoneNumber,
  aadharDocumentPath,
  panDocumentPath,
  otherDocumentsPaths
) {
  const applicationId = uuid.v4();
  // Insert loan application data into the database
  try {
    // Execute the SQL INSERT query using parameterized values
    const query = `
      INSERT INTO loan_applications 
      (id,loan_type, loan_amount, monthly_income, first_name, last_name, email, phone_number, aadhar_document, pan_document, other_documents,username) 
      VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;
    const values = [
      applicationId,
      loanType,
      loanAmount,
      monthlyIncome,
      firstName,
      lastName,
      email,
      phoneNumber,
      aadharDocumentPath,
      panDocumentPath,
      JSON.stringify(otherDocumentsPaths),
      username, // Convert array of file paths to JSON string
    ];
    const [result, fields] = await pool.query(query, values);

    const query2 = `
      INSERT INTO review
      (id,username,status_aadhar,status_pan,status_other_documents) 
      VALUES (?,?,?,?,?)
    `;
    console.log(username);
    const values_review = [
      applicationId,
      username,
      "underreview",
      "underreview",
      "underreview",
    ];
    const [res, fields_] = await pool.query(query2, values_review);

    if (result.affectedRows === 1) {
      console.log("Loan application inserted ttt successfully.");
    } else {
      console.error("Failed to insert loan application.");
    }
  } catch (error) {
    console.error("Error inserting loan application:", error);
  }
}

const generateRandomJWTSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const jwtSecretKey = generateRandomJWTSecretKey();

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.post("/api/login", async (req, res) => {
  const { username, password, role } = req.body;

  let table = "";
  if (role === "User") {
    table = "users";
  } else {
    table = "bank_employee";
  }
  try {
    // Query the database to find the user
    const [rows, fields] = await pool.query(
      `SELECT * FROM ${table} WHERE username = ?`,
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    // Compare passwords
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user_Id = user.id;
    console.log(user_Id);
    // Password is correct, generate JWT token
    const token = jwt.sign({ username: user.username, role }, jwtSecretKey, {
      expiresIn: "1h",
    });
    res.status(200).json({ token, user_Id });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
}

app.get("/api/user", authenticateToken, (req, res) => {
  res.json({ message: "User interface" });
});

app.get("/api/manager", authenticateToken, (req, res) => {
  res.json({ message: "Manager interface" });
});

app.get("/api/user-details/:user_Id", async (req, res) => {
  // Extract the username from the request parameters
  const { user_Id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM personal_details WHERE id = ?",
      [user_Id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userDetails = rows[0];
    console.log(userDetails);
    res.send(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/loan-status/:user_Id", async (req, res) => {
  try {
    const { user_Id } = req.params;

    // Retrieve loan applications for the user from personal_loan_documents table
    const [personalLoanRows] = await pool.query(
      "SELECT * FROM personal_loan_documents WHERE user_id = ?",
      [user_Id]
    );

    // Retrieve loan applications for the user from home_loan_documents table
    const [homeLoanRows] = await pool.query(
      "SELECT * FROM home_loan_documents WHERE user_id = ?",
      [user_Id]
    );

    // Retrieve loan applications for the user from car_loan_documents table
    const [carLoanRows] = await pool.query(
      "SELECT * FROM car_loan_documents WHERE user_id = ?",
      [user_Id]
    );

    // Combine all rows into a single array
    const rows = [...personalLoanRows, ...homeLoanRows, ...carLoanRows];

    // Calculate percentageReviewed for each row
    const percentageReviewedList = [];
    for (const row of rows) {
      let totalItems = 0;
      let reviewedItems = 0;

      // Determine the total number of items to review and retrieve status from respective review table
      if (row.loanType === "Personal Loan") {
        totalItems = 3;
        const [personalReviewRows] = await pool.query(
          "SELECT * FROM personal_review WHERE application_id = ?",
          [row.id]
        );
        for (const reviewRow of personalReviewRows) {
          if (reviewRow.income_document_status === "reviewed") reviewedItems++;
          if (reviewRow.address_document_status === "reviewed") reviewedItems++;
          if (reviewRow.identity_document_status === "reviewed")
            reviewedItems++;
        }
      } else if (row.loanType === "Home Loan") {
        totalItems = 1;
        const [homeReviewRows] = await pool.query(
          "SELECT * FROM home_review WHERE application_id = ?",
          [row.id]
        );
        for (const reviewRow of homeReviewRows) {
          if (reviewRow.property_document_status === "reviewed")
            reviewedItems++;
        }
      } else if (row.loanType === "Car Loan") {
        totalItems = 1;
        const [carReviewRows] = await pool.query(
          "SELECT * FROM car_review WHERE application_id = ?",
          [row.id]
        );
        for (const reviewRow of carReviewRows) {
          if (reviewRow.car_document_status === "reviewed") reviewedItems++;
        }
      }

      // Calculate percentage reviewed and push to the list
      const percentageReviewed =
        totalItems === 0 ? 0 : (reviewedItems / totalItems) * 100;
      percentageReviewedList.push(percentageReviewed);
    }

    res.json({ rows, percentageReviewedList });
  } catch (error) {
    console.error("Error calculating percentage reviewed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/application-details/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const [rows] = await pool.query(
      "SELECT * FROM loan_applications where id=? ",
      id
    );

    // Assume there's only one loan application in the database for simplicity
    const loanApplication = rows[0];

    res.json({
      first_name: loanApplication.first_name,
      last_name: loanApplication.last_name,
      loan_type: loanApplication.loan_type,
      loan_amount: loanApplication.loan_amount,
      email: loanApplication.email,
      phone_number: loanApplication.phone_number,
    });
  } catch (error) {
    console.error("Error fetching application details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/register", async (req, res) => {
  const { username, email, password, accountType } = req.body;

  try {
    // Check if user already exists
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const user_Id = uuid.v4();
    // Insert new user
    await pool.query(
      "INSERT INTO users (id,username, email, password,acc_type) VALUES (?,?, ?, ?,?)",
      [user_Id, username, email, password, accountType]
    );

    res.json({ user_Id, msg: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/personal_details", async (req, res) => {
  // Extract the form data from the request body
  try {
    const { formData, user_Id } = req.body;
    console.log(user_Id);
    console.log("hi");
    const sql =
      "INSERT INTO personal_details (id, fullName, address, city, state, postalCode, dateOfBirth, email, phoneNumber, gender, nationality, maritalStatus, occupation, educationLevel, languageProficiency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const {
      fullName,
      address,
      city,
      state,
      postalCode,
      dateOfBirth,
      email,
      phoneNumber,
      gender,
      nationality,
      maritalStatus,
      occupation,
      educationLevel,
      languageProficiency,
    } = formData;
    const values = [
      user_Id,
      fullName,
      address,
      city,
      state,
      postalCode,
      dateOfBirth,
      email,
      phoneNumber,
      gender,
      nationality,
      maritalStatus,
      occupation,
      educationLevel,
      languageProficiency,
    ];

    // Execute the SQL query
    const [result] = await pool.query(sql, values);
    console.log("hi");
    // Assuming you want to echo back the received data as a response
    res.json({ message: "Form data received successfully", formData });
  } catch (error) {
    console.error("Error inserting form data:", error);
    // Send an error response to the client
    res.status(500).json({ error: "Error inserting form data" });
  }
});

app.put("/api/user-details/:user_Id", async (req, res) => {
  try {
    const formData = req.body;
    const { user_Id } = req.params;
    console.log(user_Id);
    const sql =
      "UPDATE personal_details SET fullName=?, address=?, city=?, state=?, postalCode=?, dateOfBirth=?, email=?, phoneNumber=?, gender=?, nationality=?, maritalStatus=?, occupation=?, educationLevel=?, languageProficiency=? WHERE id=?";
    const {
      fullName,
      address,
      city,
      state,
      postalCode,
      dateOfBirth,
      email,
      phoneNumber,
      gender,
      nationality,
      maritalStatus,
      occupation,
      educationLevel,
      languageProficiency,
    } = formData;

    const values = [
      fullName,
      address,
      city,
      state,
      postalCode,
      dateOfBirth,
      email,
      phoneNumber,
      gender,
      nationality,
      maritalStatus,
      occupation,
      educationLevel,
      languageProficiency,
      user_Id,
    ];

    // Execute the SQL query
    const [result] = await pool.query(sql, values);
  } catch (error) {
    console.error("Error updating form data:", error);
    // Send an error response to the client
    res.status(500).json({ error: "Error updating form data" });
  }
});

app.get("/api/applications", async (req, res) => {
  try {
    // Fetch data from each table
    const [carLoanRows] = await pool.query("SELECT * FROM Car_loan_documents");
    const [homeLoanRows] = await pool.query(
      "SELECT * FROM home_loan_documents"
    );
    const [personalLoanRows] = await pool.query(
      "SELECT * FROM personal_loan_documents"
    );

    // Combine the results from all tables
    const applications = [
      ...carLoanRows.map((row) => ({ ...row, loanType: "Car Loan" })),
      ...homeLoanRows.map((row) => ({ ...row, loanType: "Home Loan" })),
      ...personalLoanRows.map((row) => ({ ...row, loanType: "Personal Loan" })),
    ];

    res.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Approve a loan application
app.post("/api/applications/:loanType/:id/approve", async (req, res) => {
  const { id, loanType } = req.params;

  try {
    // Get the table name based on the loan type
    const tableName = getTableName(loanType);

    // Update the status in the appropriate table
    await pool.query(
      `UPDATE ${tableName} SET status = "Approved" WHERE id = ?`,
      [id]
    );

    res.json({ message: "Application approved successfully" });
  } catch (error) {
    console.error("Error approving application:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/applications/:loanType/:id/reject", async (req, res) => {
  const { id, loanType } = req.params;

  try {
    // Get the table name based on the loan type
    const tableName = getTableName(loanType);

    // Update the status in the appropriate table
    await pool.query(
      `UPDATE ${tableName} SET status = "Rejected" WHERE id = ?`,
      [id]
    );

    res.json({ message: "Application rejected successfully" });
  } catch (error) {
    console.error("Error rejecting application:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to get the table name based on the loan type
function getTableName(loanType) {
  switch (loanType) {
    case "Car Loan":
      return "car_loan_documents";
    case "Home Loan":
      return "home_loan_documents";
    case "Personal Loan":
      return "personal_loan_documents";
    default:
      throw new Error("Invalid loan type");
  }
}
// Assume you have already set up your express app and connected it to your database

// Endpoint to fetch application details by ID and loan type
app.get("/api/applications/:loanType/:id", async (req, res) => {
  const { id, loanType } = req.params;

  try {
    console.log("appli");
    // Get the table name based on the loan type
    const tableName = getTableName(loanType);

    // Fetch application details from the appropriate table
    const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE id = ?`, [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    const application = rows[0];
    res.json({ application });
  } catch (error) {
    console.error("Error fetching application details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
const pdfDirectory = path.join(__dirname, "uploads");
app.get("/api/doc/uploads/:fileName", (req, res) => {
  try {
    console.log("docs");
    const { fileName } = req.params;
    const filePath = path.join(pdfDirectory, fileName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found");
    }

    // Read the file and send it as a response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).send("Internal Server Error");
  }
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
