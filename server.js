require("dotenv").config()

const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")

const app = express()

// Middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

// Serve static frontend files
app.use(express.static(path.join(__dirname)))

// Home route
app.get("/", (req, res) => {
    res.send("Digitech Fitness & Wellness Lab Server Running 💪")
})

// =============================
// MEMBER REGISTRATION ENDPOINT
// =============================
app.post("/register-member", (req, res) => {

    const { name, phone, plan } = req.body

    console.log("New Member:", name, phone, plan)

    res.json({
        message: "Member registered successfully",
        member: { name, phone, plan }
    })
})


// =============================
// PAYMENT ENDPOINT (MPESA)
// =============================
app.post("/pay", (req, res) => {

    const { phone, amount } = req.body

    console.log("Payment Request:", phone, amount)

    // STK push will be integrated here later
    res.json({
        message: "Payment request received",
        phone,
        amount
    })
})


// =============================
// MPESA CALLBACK
// =============================
app.post("/callback", (req, res) => {

    console.log("MPESA CALLBACK RECEIVED")
    console.log(JSON.stringify(req.body, null, 2))

    res.sendStatus(200)
})


// =============================
// RECEIPTS ROUTE
// =============================
app.get("/receipts/:id", (req, res) => {

    const receiptId = req.params.id

    res.json({
        message: "Receipt request",
        receipt: receiptId
    })
})


// =============================
// START SERVER
// =============================

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Digitech Fitness Server running on port ${PORT}`)
})
