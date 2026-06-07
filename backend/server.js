const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Working");
});

app.post("/api/register", (req, res) => {
  const { fullName, businessName, email, password } = req.body;

  const sql = `
    INSERT INTO users
    (id, full_name, business_name, email, password_hash)
    VALUES (UUID(), ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [fullName, businessName, email, password],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: "Registration failed"
        });
      }

      res.json({
        message: "User registered successfully"
      });
    }
  );
});
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE email = ? AND password_hash = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: "Login failed",
      });
    }

    if (result.length > 0) {
      res.json({
        message: "Login successful",
      });
    } else {
      res.status(401).json({
        error: "Invalid email or password",
      });
    }
  });
});
app.listen(8000, () => {
  console.log("Server running on port 8000");
});