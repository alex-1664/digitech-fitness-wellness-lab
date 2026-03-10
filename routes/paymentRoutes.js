const express = require("express")
const router = express.Router()
const axios = require("axios")
let { members } = require("../data/members.json")
let payments = require("../data/payments.json")
const path = require("path")
const fs = require("fs")

// M-PESA STK Push simulation
router.post("/pay", async (req,res)=>{
  const { memberId, amount } = req.body
  const member = members.find(m => m.id === memberId)
  if(!member) return res.json({success:false, msg:"Member not found"})

  // Here you would call Safaricom STK API using axios
  // For demo, we simulate success
  const payment = {
    memberId,
    name: member.name,
    amount,
    date: new Date(),
    receipt: `receipt-${Date.now()}.pdf`
  }

  payments.push(payment)

  // Simulate receipt PDF creation
  fs.writeFileSync(path.join(__dirname,"../receipts",payment.receipt),`Receipt\nMember: ${member.name}\nAmount: ${amount}\nDate: ${payment.date}`)

  // Optionally save payments to JSON file
  // fs.writeFileSync("./data/payments.json", JSON.stringify(payments,null,2))

  res.json({success:true, payment})
})

// Get all payments
router.get("/", (req,res)=> res.json(payments))

module.exports = router
