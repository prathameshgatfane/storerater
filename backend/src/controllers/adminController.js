const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const pool = require("../db");

exports.dashboard = async (_req, res) => {
  const [[{ c1 }]] = await pool.query("SELECT COUNT(*) c1 FROM users");
  const [[{ c2 }]] = await pool.query("SELECT COUNT(*) c2 FROM stores");
  const [[{ c3 }]] = await pool.query("SELECT COUNT(*) c3 FROM ratings");
  res.json({ users: c1, stores: c2, ratings: c3 });
};

exports.addUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, address, password, role, store_id } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const [r] = await pool.execute(
      "INSERT INTO users (name,email,address,password_hash,role,store_id) VALUES (?,?,?,?,?,?)",
      [name, email, address || null, hash, role, store_id || null]
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY")
      return res.status(400).json({ error: "Email already exists" });
    res.status(500).json({ error: "Server error" });
  }
};
