import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "postgres",
  password: "oooo",
  port: 5432,
});

app.post("/api/register", async (req, res) => {
  const { fullName, email, password, role } = req.body;
  try {
    const existing = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (existing.rows.length > 0) return res.status(400).json({ msg: "Email already exists" });

    const newUser = await pool.query(
      "INSERT INTO users(full_name,email,password,role) VALUES($1,$2,$3,$4) RETURNING *",
      [fullName, email, password, role]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email=$1 AND password=$2", [email, password]);
    if (user.rows.length === 0) return res.status(400).json({ msg: "Invalid credentials" });

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));