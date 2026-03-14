require("dotenv").config()

const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")
const fs = require("fs")

const app = express()

// ============================
// MIDDLEWARES
// ============================
app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname)))

// ============================
// HOME ROUTE
// ============================
app.get("/", (req, res) => {
  res.send("Digitech Fitness & Wellness Lab Server Running 💪")
})

// ============================
// LOGIN PAGE
// ============================
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"))
})

// ============================
// MEMBER REGISTRATION
// ============================
app.post("/register-member", (req, res) => {
  const { name, phone, plan } = req.body

  // Load members JSON
  const membersFile = path.join(__dirname, "members.json")
  let members = []
  if (fs.existsSync(membersFile)) {
    members = JSON.parse(fs.readFileSync(membersFile))
  }

  // Create new member
  const member = {
    id: Date.now(),
    name,
    phone,
    plan,
    membershipActive: false,
    expiry: null
  }

  members.push(member)
  fs.writeFileSync(membersFile, JSON.stringify(members, null, 2))

  res.json({ message: "Member registered successfully", member })
})

// ============================
// PAYMENT REQUEST (MPESA STK PUSH)
// ============================
app.post("/pay", (req, res) => {
  const { phone, amount, memberId } = req.body

  // Temporary: log payment request
  console.log("Payment Request:", { phone, amount, memberId })

  // Later: call MPESA API here

  res.json({ message: "Payment request received", phone, amount, memberId })
})

// ============================
// MPESA CALLBACK
// ============================
app.post("/callback", (req, res) => {
  console.log("MPESA CALLBACK RECEIVED")
  console.log(JSON.stringify(req.body, null, 2))

  // Later: update membership status and generate PDF receipt

  res.sendStatus(200)
})

// ============================
// RECEIPTS DOWNLOAD
// ============================
app.get("/receipts/:id", (req, res) => {
  const receiptId = req.params.id
  const receiptPath = path.join(__dirname, "receipts", `${receiptId}.pdf`)

  if (fs.existsSync(receiptPath)) {
    res.sendFile(receiptPath)
  } else {
    res.status(404).json({ message: "Receipt not found" })
  }
})

// ============================
// START SERVER
// ============================
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Digitech Fitness Server running on port ${PORT}`)
})
