const { validationResult } = require("express-validator");
const pool = require("../db");

// List stores with average rating and user's rating
exports.listStores = async (req, res) => {
  const { q, address, sort = "name", dir = "asc" } = req.query;
  const validSortFields = ["name", "avg_rating"];
  const S = validSortFields.includes(sort) ? sort : "name";
  const D = dir?.toLowerCase() === "desc" ? "DESC" : "ASC";

  let where = "WHERE 1=1";
  const params = [];

  if (q) {
    where += " AND s.name LIKE ?";
    params.push(`%${q}%`);
  }
  if (address) {
    where += " AND s.address LIKE ?";
    params.push(`%${address}%`);
  }

  // Use current user id (null if not logged in)
  params.unshift(req.user?.id ?? null);

  const sql = `
    SELECT s.id, s.name, s.email, s.address,
           ROUND(IFNULL(AVG(r.rating), 0), 2) AS avg_rating,
           (SELECT rating FROM ratings WHERE user_id=? AND store_id=s.id LIMIT 1) AS my_rating
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    ${where}
    GROUP BY s.id
    ORDER BY ${S} ${D}
  `;

  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (e) {
    console.error("List stores error:", e);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new store
exports.createStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, address } = req.body;
    const [r] = await pool.execute(
      "INSERT INTO stores (name,email,address) VALUES (?,?,?)",
      [name, email || null, address || null]
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    console.error("Store add error:", e);
    res.status(500).json({ error: "Server error" });
  }
};

// Submit or update user rating for store
exports.rateStore = async (req, res) => {
  const userId = req.user.id;
  const storeId = req.params.id;
  let { rating } = req.body;

  rating = Number(rating);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5." });
  }

  try {
    const [[existing]] = await pool.query(
      "SELECT id FROM ratings WHERE user_id=? AND store_id=?",
      [userId, storeId]
    );
    if (existing) {
      await pool.query(
        "UPDATE ratings SET rating=? WHERE user_id=? AND store_id=?",
        [rating, userId, storeId]
      );
    } else {
      await pool.query(
        "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
        [userId, storeId, rating]
      );
    }
    res.json({ message: "Rating saved." });
  } catch (err) {
    console.error("Rate store error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get Store Owner dashboard data: store info, average rating, list of users who rated
exports.getStoreOwnerDashboard = async (req, res) => {
  const storeId = req.user.store_id;

  if (!storeId) {
    return res.status(404).json({ error: "Store not assigned to this user" });
  }

  try {
    const [[store]] = await pool.query(
      "SELECT * FROM stores WHERE id = ?",
      [storeId]
    );

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    const [[avgRatingData]] = await pool.query(
      "SELECT AVG(rating) AS avg_rating FROM ratings WHERE store_id = ?",
      [storeId]
    );

    const [userRatings] = await pool.query(
      `SELECT u.id AS user_id, u.name AS user_name, r.rating
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?`,
      [storeId]
    );

    res.json({
      store,
      avg_rating: avgRatingData.avg_rating || 0,
      user_ratings: userRatings,
    });
  } catch (err) {
    console.error("Store Owner dashboard data error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
