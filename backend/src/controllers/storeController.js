const { validationResult } = require("express-validator");
const pool = require("../db");

// GET /api/stores?q=&address=&sort=name|avg_rating&dir=asc|desc
exports.listStores = async (req, res) => {
  const { q, address, sort = "name", dir = "asc" } = req.query;
  const S = ["name", "avg_rating"].includes(sort) ? sort : "name";
  const D = dir?.toLowerCase() === "desc" ? "DESC" : "ASC";

  let where = "WHERE 1=1";
  const params = [];

  if (q) { where += " AND s.name LIKE ?"; params.push(`%${q}%`); }
  if (address) { where += " AND s.address LIKE ?"; params.push(`%${address}%`); }

  // For per-user rating column we need the current user id (requireAuth before this)
  params.unshift(req.user?.id ?? null);

  const sql = `
    SELECT s.id, s.name, s.email, s.address,
           ROUND(AVG(r.rating),2) AS avg_rating,
           (SELECT rating FROM ratings WHERE user_id=? AND store_id=s.id) AS my_rating
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    ${where}
    GROUP BY s.id
    ORDER BY ${S} ${D}`;

  const [rows] = await pool.query(sql, params);
  res.json(rows);
};

exports.createStore = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, address } = req.body;
  const [r] = await pool.execute(
    "INSERT INTO stores (name,email,address) VALUES (?,?,?)",
    [name, email || null, address || null]
  );
  res.status(201).json({ id: r.insertId });
};
