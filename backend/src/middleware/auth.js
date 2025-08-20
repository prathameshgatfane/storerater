const jwt = require("jsonwebtoken");
require("dotenv").config();

// Expect header: Authorization: Bearer <token>
const requireAuth = (req, res, next) => {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid/expired token" });
  }
};

const allowRoles = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role) ? next() : res.status(403).json({ error: "Forbidden" });

module.exports = { requireAuth, allowRoles };
