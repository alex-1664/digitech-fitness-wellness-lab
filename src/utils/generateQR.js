const express = require("express");
const router = express.Router();
const generateQR = require("../utils/generateQR");

// Mock member database
let members = [
  { memberId: "DFL1023", name: "John Doe", photo: "/uploads/member1.jpg", expiry: "2026-12-31" },
  { memberId: "DFL1024", name: "Jane Smith", photo: "/uploads/member2.jpg", expiry: "2026-12-31" }
];

// Create QR code for member
router.get("/:id", async (req, res) => {
  const memberId = req.params.id;
  const member = members.find(m => m.memberId === memberId);

  if (!member) return res.status(404).json({ error: "Member not found" });

  const qrCode = await generateQR(`DIGITECH_MEMBER:${memberId}`);
  res.json({ ...member, qrCode });
});

module.exports = router;
