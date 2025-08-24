const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

const sign = (user) =>
  jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      store_id: user.store_id || null,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, address, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const [r] = await pool.execute(
      "INSERT INTO users (name,email,address,password_hash,role) VALUES (?,?,?,?,?)",
      [name, email, address || null, hash, "USER"]
    );
    const [[user]] = await pool.query("SELECT * FROM users WHERE id=?", [r.insertId]);
    res.status(201).json({ token: sign(user) });
  } catch (e) {
    console.error("Signup error:", e);  // <-- Logs detailed error to console
    if (e.code === "ER_DUP_ENTRY")
      return res.status(400).json({ error: "Email already exists" });
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  res.json({ token: sign(user) });
};

exports.updatePassword = async (req, res) => {
  const { password } = req.body;
  const pwdRe = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
  if (!pwdRe.test(password))
    return res.status(400).json({ error: "Password must be 8–16, include 1 uppercase & 1 special char" });
  const hash = await bcrypt.hash(password, 10);
  await pool.execute("UPDATE users SET password_hash=? WHERE id=?", [hash, req.user.id]);
  res.json({ ok: true });
};

exports.me = async (req, res) => {
  res.json({
    id: req.user.id,
    role: req.user.role,
    name: req.user.name,
    email: req.user.email,
    store_id: req.user.store_id || null,
  });
};
