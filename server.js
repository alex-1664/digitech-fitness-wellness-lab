require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const pgSession = require("connect-pg-simple")(session);
const pool = require("./src/models/db");

const { createDefaultAdmin, findAdmin, verifyPassword } = require("./src/models/adminModel");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session (PostgreSQL)
app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: "session"
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  }
}));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Create default admin
createDefaultAdmin();

// LOGIN
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

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// AUTH MIDDLEWARE
function requireAdmin(req, res, next) {
  if (req.session.admin) {
    return next();
  }
  res.redirect("/login.html");
}

// Protect pages
app.use("/dashboard.html", requireAdmin);
app.use("/scan.html", requireAdmin);
app.use("/members.html", requireAdmin);
app.use("/admin.html", requireAdmin);

// API routes
app.use("/api/members", require("./src/routes/memberRoutes"));
app.use("/attendance", require("./src/routes/attendanceRoutes"));
app.use("/api/dashboard", require("./src/routes/dashboardRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));

// Root
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// Start server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
