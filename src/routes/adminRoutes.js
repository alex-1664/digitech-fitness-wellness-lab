// src/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../models/db");
const bcrypt = require("bcrypt");

// Middleware to protect admin routes
function requireAdmin(req, res, next) {
  if (req.session.admin) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// Get all admins
router.get("/", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username FROM admins ORDER BY id");
    res.json({ admins: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new admin
router.post("/add", requireAdmin, async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO admins(username,password) VALUES($1,$2)",
      [username, hash]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update admin password
router.post("/update", requireAdmin, async (req, res) => {
  const { id, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query("UPDATE admins SET password=$1 WHERE id=$2", [hash, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete admin
router.post("/delete", requireAdmin, async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query("DELETE FROM admins WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
