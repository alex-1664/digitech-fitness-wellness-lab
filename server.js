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
