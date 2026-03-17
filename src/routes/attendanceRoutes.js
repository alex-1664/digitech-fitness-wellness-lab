const express = require("express");
const router = express.Router();
const pool = require("../models/db");

router.post("/checkin", async (req,res)=>{
  const { memberId } = req.body;

  await pool.query(
    "INSERT INTO attendance(member_id) VALUES($1)",
    [memberId]
  );

  res.json({success:true, name:memberId});
});

module.exports = router;
