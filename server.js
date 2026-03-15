require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
const memberRoutes = require("./src/routes/memberRoutes");
const attendanceRoutes = require("./src/routes/attendanceRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

app.use("/api/members", memberRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Root
app.get("/", (req, res) => {
  res.send("Digitech Fitness & Wellness Lab Server Running");
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
