const pool = require("../db");

// POST /api/ratings  { store_id, rating }
exports.upsertRating = async (req, res) => {
  const { store_id, rating } = req.body;
  if (!Number.isInteger(store_id)) return res.status(400).json({ error: "store_id required" });
  if (!(Number.isInteger(rating) && rating >= 1 && rating <= 5))
    return res.status(400).json({ error: "Rating must be 1–5" });

  await pool.execute(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
    [req.user.id, store_id, rating]
  );
  res.json({ ok: true });
};

// GET /api/ratings/owner  (OWNER only) → their store’s ratings + average
exports.ownerRatings = async (req, res) => {
  if (!req.user.store_id)
    return res.status(400).json({ error: "Owner has no store_id assigned" });

  const [raters] = await pool.execute(
    `SELECT u.name, u.email, r.rating, r.created_at
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id = ?
     ORDER BY r.created_at DESC`,
    [req.user.store_id]
  );
  const [[{ avg }]] = await pool.query(
    "SELECT ROUND(AVG(rating), 2) AS avg FROM ratings WHERE store_id=?",
    [req.user.store_id]
  );
  res.json({ average: avg || 0, raters });
};
