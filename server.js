require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")
const fs = require("fs")

const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

// Routes
app.use("/auth", require("./routes/authRoutes"))
app.use("/members", require("./routes/memberRoutes"))
app.use("/payments", require("./routes/paymentRoutes"))
app.use("/attendance", require("./routes/attendanceRoutes"))
app.use("/progress", require("./routes/progressRoutes"))

// Health check and login redirect
app.get("/", (req, res) => res.send("Digitech Fitness & Wellness Lab Server Running 💪"))
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")))

// Serve receipts publicly
app.use("/receipts", express.static(path.join(__dirname, "receipts")))

// Ensure JSON data files exist
const dataFiles = [
  { path: "./data/members.json", default: [] },
  { path: "./data/attendance.json", default: [] },
  { path: "./data/payments.json", default: [] },
]

dataFiles.forEach(file => {
  const fullPath = path.join(__dirname, file.path)
  if (!fs.existsSync(fullPath)) fs.writeFileSync(fullPath, JSON.stringify(file.default, null, 2))
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Digitech Fitness Server running on port ${PORT}`))
