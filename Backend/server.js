const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test MySQL connection
async function testDatabaseConnection() {
    try {
        const connection = await db.getConnection();
        console.log("MySQL connected successfully");
        connection.release();
    } catch (error) {
        console.error("MySQL connection failed:", error.message);
    }
}

// ===============================
// USER REGISTRATION
// ===============================

const bcrypt = require("bcryptjs");

app.post("/api/register", async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      phone,
      role,
      age,
      gender,
      blood_group,
      city,
      address,
      available
    } = req.body;


    // Check required fields

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !role ||
      !age ||
      !gender ||
      !blood_group ||
      !city ||
      !address
    ) {

      return res.status(400).json({
        message: "Please fill all required fields"
      });

    }


    // Check whether email already exists

    const [existingUser] = await db.execute(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );


    if (existingUser.length > 0) {

      return res.status(409).json({
        message: "Email already registered"
      });

    }


    // Hash password

    const hashedPassword = await bcrypt.hash(password, 10);


    // Insert user

    const [userResult] = await db.execute(
      `INSERT INTO users
      (name, email, password, phone, role)
      VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        email,
        hashedPassword,
        phone,
        role
      ]
    );

if (role.trim().toUpperCase() === "DONOR") {

  await db.execute(
    `INSERT INTO donors
    (donor_id, name, age, gender, blood_group, phone, email, city, address, available)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userResult.insertId,
      name,
      age,
      gender,
      blood_group,
      phone,
      email,
      city,
      address,
      available ? 1 : 0
    ]
  );

}


    // Get newly created user ID

    const userId = userResult.insertId;





    res.status(201).json({
      message: "Account created successfully",
      userId: userId
    });


  } catch (error) {

    console.error("Registration error:", error);

    res.status(500).json({
      message: "Server error during registration"
    });

  }

});

// ===============================
// USER LOGIN
// ===============================

app.post("/api/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    // Check whether email and password are provided

    if (!email || !password) {

      return res.status(400).json({
        message: "Email and password are required"
      });

    }


    // Find user by email

    const [users] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );


    // Email not found

    if (users.length === 0) {

      return res.status(401).json({
        message: "Invalid email or password"
      });

    }


    // Get the user

    const user = users[0];


    // Compare entered password with hashed password

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );


    // Password incorrect

    if (!passwordMatch) {

      return res.status(401).json({
        message: "Invalid email or password"
      });

    }


    // Login successful

    res.status(200).json({
      message: "Login successful",

      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });


  } catch (error) {

    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error during login"
    });

  }

});

// ===============================
// GET DONOR PROFILE
// ===============================

app.get("/api/donor/:userId", async (req, res) => {

  try {

    const { userId } = req.params;

    const [donors] = await db.execute(
      `SELECT
        donor_id,
        name,
        age,
        gender,
        blood_group,
        phone,
        email,
        city,
        address,
        available,
        created_at
       FROM donors
       WHERE donor_id = ?`,
      [userId]
    );


    if (donors.length === 0) {

      return res.status(404).json({
        message: "Donor profile not found"
      });

    }


    res.status(200).json({
      donor: donors[0]
    });


  } catch (error) {

    console.error("Donor profile error:", error);

    res.status(500).json({
      message: "Unable to fetch donor profile"
    });

  }

});



// ===============================
// UPDATE DONOR AVAILABILITY
// ===============================

app.put("/api/donor/:donorId/availability", async (req, res) => {

  try {

    const { donorId } = req.params;
    const { available } = req.body;


    if (available !== 0 && available !== 1) {

      return res.status(400).json({
        message: "Invalid availability value"
      });

    }


    const [result] = await db.execute(
      `UPDATE donors
       SET available = ?
       WHERE donor_id = ?`,
      [
        available,
        donorId
      ]
    );


    if (result.affectedRows === 0) {

      return res.status(404).json({
        message: "Donor not found"
      });

    }


    res.status(200).json({
      message: "Availability updated successfully",
      available: available
    });


  } catch (error) {

    console.error("Availability update error:", error);

    res.status(500).json({
      message: "Unable to update availability"
    });

  }

});


app.put("/api/donor/:userId", async (req, res) => {

  try {

    const { userId } = req.params;

    const {
      name,
      age,
      gender,
      phone,
      email,
      city,
      address
    } = req.body;


    if (
      !name ||
      !age ||
      !gender ||
      !phone ||
      !email ||
      !city ||
      !address
    ) {

      return res.status(400).json({
        message: "All fields are required"
      });

    }


    const [result] = await db.query(

      `UPDATE donor
       SET
         name = ?,
         age = ?,
         gender = ?,
         phone = ?,
         email = ?,
         city = ?,
         address = ?
      WHERE donor_id = ?`,

      [
        name,
        age,
        gender,
        phone,
        email,
        city,
        address,
        userId
      ]

    );


    if (result.affectedRows === 0) {

      return res.status(404).json({
        message: "Donor profile not found"
      });

    }


    res.json({

      message:
        "Donor profile updated successfully"

    });


  } catch (error) {

    console.error(
      "Update donor error:",
      error
    );


    res.status(500).json({

      message:
        "Server error while updating donor profile"

    });

  }

});

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Blood Donation Platform Backend is running"
    });
});

// Test database route
app.get("/api/test", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS result");

        res.json({
            message: "Backend and MySQL connected successfully",
            database: rows
        });
    } catch (error) {
        res.status(500).json({
            message: "MySQL connection failed",
            error: error.message
        });
    }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await testDatabaseConnection();
});