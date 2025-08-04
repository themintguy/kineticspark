import express from "express";
import cors from "cors";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ message: "Token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(403).json({ message: "Invalid token" });
    }
    req.userId = user.userId;
    next();
  });
};

app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const result = await pool.query(
      "INSERT INTO users (email, password_hash, verification_token) VALUES ($1, $2, $3) RETURNING id, email",
      [email, passwordHash, verificationToken]
    );

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationLink = `${process.env.CORS_ORIGIN}/api/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
      from: `"Kinetic Spark" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email address",
      html: `
        <p>Please click the following link to verify your email:</p>
        <a href="${verificationLink}">${verificationLink}</a>
      `,
    });

    res.status(201).json({
      message: "User created. Please check your email to verify your account.",
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
      },
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.rows[0].is_verified) {
      return res
        .status(403)
        .json({ message: "Please verify your email address to log in." });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, userId: user.rows[0].id, email: user.rows[0].email });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/verify-email", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Verification token is missing.");
  }

  try {
    const result = await pool.query(
      "UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = $1 RETURNING id",
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Invalid or expired verification token.");
    }
    
    const loginRedirectUrl = `${process.env.CORS_ORIGIN}/auth/login`;

    const htmlResponse = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Email Verified</title>
          <meta http-equiv="refresh" content="3; url=${loginRedirectUrl}">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 50px; background-color: #f0f4f8; }
            .container { max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            h1 { color: #2d3748; }
            p { color: #4a5568; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Email Successfully Verified!</h1>
            <p>You can now log in to your account.</p>
            <p>Redirecting to the login page in 3 seconds...</p>
          </div>
        </body>
      </html>
    `;

    res.status(200).send(htmlResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during verification.");
  }
});

app.get("/api/tasks", authenticateToken, async (req, res) => {
  try {
    const allTasks = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1::uuid ORDER BY created_at DESC",
      [req.userId]
    );
    res.json(allTasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/tasks", authenticateToken, async (req, res) => {
  const { title, description, due_date, priority, categories } = req.body;
  try {
    const newTask = await pool.query(
      "INSERT INTO tasks (user_id, title, description, due_date, priority, categories) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [req.userId, title, description, due_date, priority, categories]
    );
    res.status(201).json(newTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/tasks/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (updates.title && !updates.title.trim()) {
    return res.status(400).json({ message: "Task title cannot be empty." });
  }

  if (typeof updates.is_completed !== "undefined") {
    updates.is_completed = updates.is_completed === true;
  }

  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update." });
  }

  const setClause = fields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");
  const query = `UPDATE tasks SET ${setClause} WHERE id = $${
    fields.length + 1
  } AND user_id = $${fields.length + 2} RETURNING *`;

  try {
    const result = await pool.query(query, [...values, id, req.userId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({
          message: "Task not found or you do not have permission to update it",
        });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found or you do not have permission to delete it",
      });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
