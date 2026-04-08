const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const linkRoutes = require("./routes/link.routes");
const { redirect } = require("./controllers/link.controller");
const { connectDB } = require("./config/database");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);

app.get("/", (req, res) => {
  res.json({ message: "🚀 URL Shortener API is running" });
});

const redirectLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 4,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again in a minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/:code", redirectLimiter, redirect);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

module.exports = { app, connectDB };
