require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")
const fs = require("fs")

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

// Routes
app.use("/members", require("./routes/memberRoutes"))
app.use("/payments", require("./routes/paymentRoutes"))
app.use("/attendance", require("./routes/attendanceRoutes"))

app.get("/", (req,res)=>{
  res.send("Digitech Fitness & Wellness Lab Server Running 💪")
})

app.get("/login",(req,res)=>{
  res.sendFile(path.join(__dirname,"public","login.html"))
})

app.use("/receipts", express.static(path.join(__dirname,"receipts")))

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
  console.log("Digitech Fitness Server running on port " + PORT)
})
