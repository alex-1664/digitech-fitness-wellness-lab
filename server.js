require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

// PostgreSQL session store
const pgSession = require("connect-pg-simple")(session);
const pool = require("./src/models/db");

const { createDefaultAdmin, findAdmin, verifyPassword } = require("./src/models/adminModel");

const app = express();
const PORT = process.env.PORT || 3000;

// =====================
// Middleware
// =====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (PostgreSQL store)
app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: "session"
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false // set true if using HTTPS
  }
}));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// =====================
// Initialize Admin
// =====================
createDefaultAdmin();

// =====================
// LOGIN ROUTE
// =====================
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await findAdmin(username);

    if (!admin) {
      return res.json({ success: false, message: "User not found" });
    }

    const valid = await verifyPassword(admin, password);

    if (!valid) {
      return res.json({ success: false, message: "Wrong password" });
    }

    req.session.admin = admin.username;

    res.json({ success: true });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// =====================
// AUTH MIDDLEWARE
// =====================
function requireAdmin(req, res, next) {
  if (req.session.admin) {
    return next();
  }
  return res.redirect("/login.html");
}

// Protect pages
app.use("/dashboard.html", requireAdmin);
app.use("/scan.html", requireAdmin);
app.use("/members.html", requireAdmin);
app.use("/admin.html", requireAdmin);

// =====================
// API ROUTES
// =====================
app.use("/api/members", require("./src/routes/memberRoutes"));
app.use("/attendance", require("./src/routes/attendanceRoutes"));
app.use("/api/dashboard", require("./src/routes/dashboardRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));

// =====================
// ROOT ROUTE
// =====================
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// =====================
// START SERVER
// =====================
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
