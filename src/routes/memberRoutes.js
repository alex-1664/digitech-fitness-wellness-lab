const express = require("express");
const router = express.Router();
const pool = require("../models/db");
const QRCode = require("qrcode");

// Get member
router.get("/:id", async (req,res)=>{
  const result = await pool.query("SELECT * FROM members WHERE member_id=$1",[req.params.id]);
  const member = result.rows[0];

  if(!member) return res.status(404).json({error:"Not found"});

  const qr = await QRCode.toDataURL("DIGITECH_MEMBER:"+member.member_id);
  res.json({...member, qrCode: qr});
});

// Add member
router.post("/add", async (req,res)=>{
  const { memberId, name, photo, expiry } = req.body;

  await pool.query(
    "INSERT INTO members(member_id,name,photo,expiry) VALUES($1,$2,$3,$4)",
    [memberId,name,photo,expiry]
  );

  res.json({success:true});
});

module.exports = router;
