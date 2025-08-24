const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const pool = require("../db");

// Get admin dashboard stats: total users, stores, ratings
exports.getAdminStats = async (_req, res) => {
  try {
    const [[{ c1 }]] = await pool.query("SELECT COUNT(*) c1 FROM users");
    const [[{ c2 }]] = await pool.query("SELECT COUNT(*) c2 FROM stores");
    const [[{ c3 }]] = await pool.query("SELECT COUNT(*) c3 FROM ratings");
    res.json({ users: c1, stores: c2, ratings: c3 });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Add a new user
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
    console.error("Add user error:", e);
    res.status(500).json({ error: "Server error" });
  }
};

// List users with search, filter and sorting for Admins
exports.listUsers = async (req, res) => {
  try {
    const { q = "", email = "", address = "", role = "", sort = "name", dir = "asc" } = req.query;

    const allowedSort = ["name", "email", "address", "role"];
    const allowedDir = ["asc", "desc"];
    const S = allowedSort.includes(sort.toLowerCase()) ? sort : "name";
    const D = allowedDir.includes(dir.toLowerCase()) ? dir.toUpperCase() : "ASC";

    let where = "WHERE 1=1";
    const params = [];

    if (q) { where += " AND name LIKE ?"; params.push(`%${q}%`); }
    if (email) { where += " AND email LIKE ?"; params.push(`%${email}%`); }
    if (address) { where += " AND address LIKE ?"; params.push(`%${address}%`); }
    if (role) { where += " AND role = ?"; params.push(role); }

    const sql = `SELECT id, name, email, address, role FROM users ${where} ORDER BY ${S} ${D}`;

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error("Admin list users error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get user details
exports.getUserDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const [[user]] = await pool.query("SELECT id, name, email, address, role FROM users WHERE id = ?", [id]);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get user details error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, address, role, password } = req.body;

  try {
    const fields = [];
    const values = [];

    if (name) {
      fields.push("name = ?");
      values.push(name);
    }
    if (email) {
      fields.push("email = ?");
      values.push(email);
    }
    if (address) {
      fields.push("address = ?");
      values.push(address);
    }
    if (role) {
      fields.push("role = ?");
      values.push(role);
    }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      fields.push("password_hash = ?");
      values.push(hash);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(id);

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    const [result] = await pool.execute(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// List stores with average rating
exports.listStores = async (req, res) => {
  try {
    const { name = "", email = "", address = "", sort = "name", dir = "asc" } = req.query;
    const allowedSort = ["name", "email", "address", "rating"];
    const S = allowedSort.includes(sort) ? sort : "name";
    const D = dir.toLowerCase() === "desc" ? "DESC" : "ASC";

    const where = "WHERE s.name LIKE ? AND (s.email LIKE ? OR ? = '') AND (s.address LIKE ? OR ? = '')";
    const params = [`%${name}%`, `%${email}%`, email, `%${address}%`, address];

    const orderByColumn = {
      name: "s.name",
      email: "s.email",
      address: "s.address",
      rating: "rating"
    }[S] || "s.name";

    const sql = `
      SELECT 
        s.id, 
        s.name, 
        s.email, 
        s.address, 
        IFNULL(AVG(r.rating), 0) AS rating,
        COUNT(r.id) AS rating_count
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      ${where}
      GROUP BY s.id
      ORDER BY ${orderByColumn} ${D}
    `;


    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("listStores error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get store details
exports.getStoreDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const [[store]] = await pool.query("SELECT id, name, email, address FROM stores WHERE id = ?", [id]);
    if (!store) return res.status(404).json({ error: "Store not found" });
    res.json(store);
  } catch (err) {
    console.error("Get store details error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update store details
exports.updateStore = async (req, res) => {
  const { id } = req.params;
  const { name, email, address } = req.body;
  try {
    await pool.query(
      "UPDATE stores SET name = ?, email = ?, address = ? WHERE id = ?",
      [name, email, address, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Update store error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete store
exports.deleteStore = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM stores WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete store error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
