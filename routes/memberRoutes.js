const express = require("express")
const router = express.Router()
const fs = require("fs")
const path = require("path")
const generateQR = require("../utils/generateQR")

const membersFile = path.join(__dirname,"../data/members.json")

router.get("/",(req,res)=>{
  const members = JSON.parse(fs.readFileSync(membersFile))
  res.json(members)
})

router.post("/register", async (req,res)=>{
  const { name, phone, plan } = req.body

  let members = JSON.parse(fs.readFileSync(membersFile))

  const memberId = Date.now()

  const qrLink = await generateQR(memberId)

  const member = {
    id: memberId,
    name,
    phone,
    plan,
    membershipActive:false,
    qr:qrLink
  }

  members.push(member)

  fs.writeFileSync(membersFile,JSON.stringify(members,null,2))

  res.json(member)
})

module.exports = router
