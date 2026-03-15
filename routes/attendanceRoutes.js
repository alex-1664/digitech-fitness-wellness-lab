const express = require("express")
const router = express.Router()
const fs = require("fs")
const path = require("path")

const attendanceFile = path.join(__dirname,"../data/attendance.json")

router.get("/",(req,res)=>{
  const data = JSON.parse(fs.readFileSync(attendanceFile))
  res.json(data)
})

router.post("/scan",(req,res)=>{

  const {memberId} = req.body

  let attendance = JSON.parse(fs.readFileSync(attendanceFile))

  const record = {
    id:Date.now(),
    memberId,
    time:new Date()
  }

  attendance.push(record)

  fs.writeFileSync(attendanceFile,JSON.stringify(attendance,null,2))

  res.json({
    message:`Attendance recorded for ${memberId}`
  })

})

module.exports = router
