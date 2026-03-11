require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const cron = require("node-cron");

const app = express();

// Routes
const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Middleware
const authMiddleware = require("./middleware/authMiddleware");

// Utils
const checkMembershipExpiry = require("./utils/checkMembershipExpiry");

// Data
const membersData = require("./data/members.json");
let attendanceRecords = []; // Initialize empty attendance

// -------------------
// BASIC CONFIG
// -------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------
// SESSION LOGIN
// -------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// -------------------
// STATIC FILES
// -------------------
app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "public", "styles")));
app.use("/js", express.static(path.join(__dirname, "public", "scripts")));
app.use("/receipts", express.static(path.join(__dirname, "receipts")));

// -------------------
// API ROUTES
// -------------------
app.use("/auth", authRoutes);
app.use("/members", authMiddleware, memberRoutes);
app.use("/payments", authMiddleware, paymentRoutes);
app.use("/attendance", authMiddleware, attendanceRoutes);
app.use("/ai", authMiddleware, aiRoutes);

// -------------------
// PROTECTED DASHBOARD PAGES
// -------------------
app.get("/members.html", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "members.html"));
});

app.get("/payments.html", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "payments.html"));
});

app.get("/attendance.html", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "attendance.html"));
});

app.get("/ai.html", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ai.html"));
});

app.get("/dashboard.html", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// -------------------
// ROOT PAGE
// -------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// -------------------
// LOGOUT
// -------------------
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

// -------------------
// ATTENDANCE CHECK-IN EXAMPLE
// -------------------
app.post("/attendance/checkin", (req, res) => {
  const memberId = req.body.memberId;

  const member = membersData.find((m) => m.id === memberId);

  if (!member) {
    return res.json({ success: false });
  }

  const attendance = {
    memberId: memberId,
    name: member.name,
    date: new Date(),
  };

  attendanceRecords.push(attendance);

  res.json({
    success: true,
    name: member.name,
  });
});

// -------------------
// CRON JOB
// -------------------
cron.schedule("0 9 * * *", () => {
  console.log("Checking membership expiry...");
  checkMembershipExpiry(membersData);
});

// -------------------
// SERVER START
// -------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Digitech Fitness System Running on port ${PORT}`);
});
