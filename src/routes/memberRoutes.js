// src/routes/memberRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../models/db");
const QRCode = require("qrcode");

// Get member info + QR code
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM members WHERE member_id=$1", [req.params.id]);
    const member = result.rows[0];
    if (!member) return res.status(404).json({ error: "Not found" });

    const qr = await QRCode.toDataURL("DIGITECH_MEMBER:" + member.member_id);
    res.json({ ...member, qrCode: qr });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add new member
router.post("/add", async (req, res) => {
  const { memberId, name, photo, expiry } = req.body;
  try {
    await pool.query(
      "INSERT INTO members(member_id,name,photo,expiry) VALUES($1,$2,$3,$4)",
      [memberId, name, photo, expiry]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
