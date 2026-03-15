const express = require("express");
const router = express.Router();

let attendance = [];

router.post("/checkin", (req, res) => {
  const { memberId } = req.body;
  if (!memberId) return res.json({ success: false });

  const record = { memberId, time: new Date(), name: memberId };
  attendance.push(record);

  res.json({ success: true, name: memberId });
});

router.get("/records", (req, res) => {
  res.json(attendance);
});

module.exports = router;
