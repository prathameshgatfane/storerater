const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to require a valid JWT and attach decoded user info to req.user
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

// Middleware to allow access only for users with allowed roles
const allowRoles = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role) ? next() : res.status(403).json({ error: "Forbidden" });

module.exports = { requireAuth, allowRoles };
