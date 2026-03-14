require("dotenv").config()

const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const authRoutes = require("./routes/authRoutes")
const memberRoutes = require("./routes/memberRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const attendanceRoutes = require("./routes/attendanceRoutes")
const aiRoutes = require("./routes/aiRoutes")

app.use("/auth", authRoutes)
app.use("/members", memberRoutes)
app.use("/payments", paymentRoutes)
app.use("/attendance", attendanceRoutes)
app.use("/ai", aiRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
