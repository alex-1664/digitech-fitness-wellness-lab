// src/routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../models/db");

// Check-in via QR scanner
router.post("/checkin", async (req, res) => {
  const { memberId } = req.body;
  try {
    const result = await pool.query("SELECT * FROM members WHERE member_id=$1", [memberId]);
    if (result.rows.length === 0) return res.json({ success: false, message: "Member not found" });

    await pool.query("INSERT INTO attendance(member_id) VALUES($1)", [memberId]);
    res.json({ success: true, name: result.rows[0].name });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
