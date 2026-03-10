require("dotenv").config()

const express = require("express")
const path = require("path")
const cors = require("cors")
const session = require("express-session")

const app = express()

// Routes
const authRoutes = require("./routes/authRoutes")
const memberRoutes = require("./routes/memberRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const attendanceRoutes = require("./routes/attendanceRoutes")
const aiRoutes = require("./routes/aiRoutes")

// Middleware
const authMiddleware = require("./middleware/authMiddleware")

// -------------------
// BASIC CONFIG
// -------------------

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// -------------------
// SESSION LOGIN
// -------------------

app.use(
session({
secret: process.env.SESSION_SECRET,
resave: false,
saveUninitialized: false
})
)

// -------------------
// STATIC FILES
// -------------------

app.use(express.static("public"))
app.use("/css", express.static("css"))
app.use("/js", express.static("js"))

// -------------------
// RECEIPTS ACCESS
// -------------------

app.use(
"/receipts",
express.static(path.join(__dirname, "receipts"))
)

// -------------------
// API ROUTES
// -------------------

app.use("/auth", authRoutes)

app.use("/members", authMiddleware, memberRoutes)

app.use("/payments", authMiddleware, paymentRoutes)

app.use("/attendance", authMiddleware, attendanceRoutes)

app.use("/ai", authMiddleware, aiRoutes)

// -------------------
// PROTECTED DASHBOARD PAGES
// -------------------

app.get("/members.html", authMiddleware, (req, res) => {
res.sendFile(path.join(__dirname, "public", "members.html"))
})

app.get("/payments.html", authMiddleware, (req, res) => {
res.sendFile(path.join(__dirname, "public", "payments.html"))
})

app.get("/attendance.html", authMiddleware, (req, res) => {
res.sendFile(path.join(__dirname, "public", "attendance.html"))
})

app.get("/ai.html", authMiddleware, (req, res) => {
res.sendFile(path.join(__dirname, "public", "ai.html"))
})

// -------------------
// ROOT PAGE
// -------------------

app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "public", "login.html"))
})

// -------------------
// LOGOUT
// -------------------

app.get("/logout", (req, res) => {

req.session.destroy(() => {

res.redirect("/login.html")

})

})

// -------------------
// SERVER START
// -------------------

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {

console.log("Digitech Fitness System Running")
app.get("/dashboard.html", authMiddleware, (req,res)=>{
res.sendFile(__dirname + "/public/dashboard.html")
})
console.log("Server running on port:", PORT)

})
app.post("/attendance/checkin",(req,res)=>{

const memberId = req.body.memberId

// Example database lookup
const member = members.find(m => m.id === memberId)

if(!member){

return res.json({success:false})

}

const attendance = {
memberId:memberId,
name:member.name,
date:new Date()
}

attendanceRecords.push(attendance)

res.json({
success:true,
name:member.name
})

})
const cron = require("node-cron")
const checkMembershipExpiry = require("./utils/checkMembershipExpiry")

cron.schedule("0 9 * * *", () => {

console.log("Checking membership expiry...")

checkMembershipExpiry(members)

})
const cron = require("node-cron")
const checkMembershipExpiry = require("./utils/checkMembershipExpiry")
const { members } = require("./data/members.json")

cron.schedule("0 9 * * *", () => {
  console.log("Checking membership expiry...")
  checkMembershipExpiry(members)
})
