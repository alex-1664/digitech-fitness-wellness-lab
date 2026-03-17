// src/routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../models/db");

router.get("/", async (req, res) => {
  try {
    const members = await pool.query("SELECT COUNT(*) FROM members");
    const today = await pool.query("SELECT COUNT(*) FROM attendance WHERE DATE(time)=CURRENT_DATE");
    const revenue = await pool.query("SELECT SUM(amount) FROM payments");

    const daily = await pool.query(`
      SELECT TO_CHAR(time,'Dy') as day, COUNT(*) as count
      FROM attendance
      WHERE time >= NOW() - INTERVAL '7 days'
      GROUP BY day
      ORDER BY day
    `);

    const monthly = await pool.query("SELECT month, amount FROM payments");

    res.json({
      members: parseInt(members.rows[0].count),
      checkins: parseInt(today.rows[0].count),
      revenue: parseInt(revenue.rows[0].sum || 0),
      expiring: 0, // can calculate based on expiry
      dailyCheckins: daily.rows,
      monthlyRevenue: monthly.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
