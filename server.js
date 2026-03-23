require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const { createDefaultAdmin, findAdmin, verifyPassword } = require("./src/models/adminModel");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: false
}));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Create default admin safely
(async () => {
  try {
    await createDefaultAdmin();
    console.log("Default admin created");
  } catch (err) {
    console.error("Error creating admin:", err.message);
  }
})();

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await findAdmin(username);

    if (!admin) return res.json({ success: false, message: "User not found" });

    const valid = await verifyPassword(admin, password);
    if (!valid) return res.json({ success: false, message: "Wrong password" });

    req.session.admin = admin.username;
    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// AUTH MIDDLEWARE
function requireAdmin(req, res, next) {
  if (req.session.admin) return next();
  res.redirect("/login.html");
}

// PROTECTED PAGES
app.get("/dashboard.html", requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "public/dashboard.html"));
});

app.get("/scan.html", requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "public/scan.html"));
});

// ROUTES (make sure these files exist)
app.use("/api/members", require("./src/routes/memberRoutes"));
app.use("/attendance", require("./src/routes/attendanceRoutes"));
app.use("/api/dashboard", require("./src/routes/dashboardRoutes"));

// ROOT
app.get("/", (req, res) => res.redirect("/login.html"));

// START SERVER
app.listen(PORT, () => console.log("Server running on port " + PORT));
