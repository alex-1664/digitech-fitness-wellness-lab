const express = require("express");
const router = express.Router();
const pool = require("../models/db");
const QRCode = require("qrcode");

// =====================
// CREATE MEMBER
// =====================
router.post("/add", async (req, res) => {
  try {
    const { name, phone, membership } = req.body;

    // Insert member into DB
    const result = await pool.query(
      "INSERT INTO members(name, phone, membership) VALUES($1,$2,$3) RETURNING *",
      [name, phone, membership]
    );

    const member = result.rows[0];

    // Generate QR code (contains member ID)
    const qrData = `MEMBER:${member.id}`;

    const qrCodeImage = await QRCode.toDataURL(qrData);

    res.json({
      success: true,
      member,
      qr: qrCodeImage
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error adding member" });
  }
});

// =====================
// GET ALL MEMBERS
// =====================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM members ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
