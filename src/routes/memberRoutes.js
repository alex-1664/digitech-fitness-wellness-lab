const express = require("express");
const router = express.Router();
const pool = require("../models/db");
const QRCode = require("qrcode");

// CREATE MEMBER
router.post("/add", async (req, res) => {
  try {
    const { name, phone, membership } = req.body;

    const result = await pool.query(
      "INSERT INTO members(name, phone, membership) VALUES($1,$2,$3) RETURNING *",
      [name, phone, membership]
    );

    const member = result.rows[0];

    // Generate QR
    const qr = await QRCode.toDataURL(`MEMBER:${member.id}`);

    res.json({
      success: true,
      member,
      qr
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET MEMBERS
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM members ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
