const express = require("express");
const router = express.Router();

// Mock dashboard data
router.get("/", (req, res) => {
  const stats = {
    members: 120,
    checkins: 45,
    revenue: 65000,
    expiring: 7
  };
  res.json(stats);
});

module.exports = router;
