const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); // Add morgan for logging
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Add morgan middleware to log all HTTP requests in 'dev' format (method, URL, status, response time)
app.use(morgan("dev"));

// Health check
app.get("/", (_req, res) => res.send("StoreRater API running 🚀"));

// Routes
// Note: store routes are mounted under /api/stores so frontend should POST to /api/stores
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/admin", adminRoutes);

// Optional: global error handler, logs errors to console and responds with a 500 error
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
