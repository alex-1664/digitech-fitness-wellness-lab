const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { stkPush, getAccessToken } = require("./mpesa");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Ensure receipts folder exists
if(!fs.existsSync("receipts")) fs.mkdirSync("receipts");

// Payment endpoint
app.post("/pay", async (req, res) => {
    try {
        const { name, phone, plan, amount } = req.body;

        // Send STK Push
        const stkResponse = await stkPush(phone, amount);

        // Generate unique receipt number
        const receiptNo = "DG" + Math.floor(1000 + Math.random() * 9000);

        // Prepare receipt data
        const receiptData = { receipt: receiptNo, name, phone, plan, amount, mpesa: "Pending" };

        // Save JSON for server use (optional)
        fs.writeFileSync(path.join("receipts", `${receiptNo}.json`), JSON.stringify(receiptData));

        res.json({ stkResponse, receiptData });
    } catch (err) {
        console.log(err);
        res.status(500).send("Payment failed");
    }
});

// MPESA Callback to confirm payment
app.post("/callback", (req, res) => {
    const callbackData = req.body;
    console.log("MPESA Callback:", JSON.stringify(callbackData, null, 2));

    // Update receipt with actual MPESA code
    const mpesaCode = callbackData.Body.stkCallback.CallbackMetadata.Item.find(i => i.Name === "MpesaReceiptNumber").Value;
    const receiptFile = path.join("receipts", "DG2451.json"); // match receipt number dynamically
    if(fs.existsSync(receiptFile)){
        const data = JSON.parse(fs.readFileSync(receiptFile));
        data.mpesa = mpesaCode;
        fs.writeFileSync(receiptFile, JSON.stringify(data));
    }

    // TODO: Send SMS with download link using Safaricom SMS API

    res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port", process.env.PORT || 3000);
});
