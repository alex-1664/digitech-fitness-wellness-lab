const express = require("express")
const router = express.Router()
let { members } = require("../data/members.json")
let attendanceRecords = require("../data/attendance.json")

// QR Check-in
router.post("/checkin", (req,res)=>{
  const { memberId } = req.body
  const member = members.find(m => m.id === memberId)
  if(!member) return res.json({success:false})

  const attendance = {
    memberId,
    name: member.name,
    date: new Date()
  }
  attendanceRecords.push(attendance)

  // Optionally save to JSON file if using file system
  // fs.writeFileSync("./data/attendance.json", JSON.stringify(attendanceRecords,null,2))

  res.json({success:true, name: member.name})
})

// Get all attendance
router.get("/", (req,res)=> res.json(attendanceRecords))

module.exports = router
