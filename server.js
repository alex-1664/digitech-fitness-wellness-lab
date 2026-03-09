const { sendSMS } = require("./sms"); // import SMS function

app.post("/callback", async (req, res) => {
    const callbackData = req.body;
    console.log("MPESA Callback:", JSON.stringify(callbackData, null, 2));

    // Extract MPESA receipt code
    const mpesaCode = callbackData.Body.stkCallback.CallbackMetadata.Item.find(
        i => i.Name === "MpesaReceiptNumber"
    ).Value;

    // Load receipt JSON
    const receiptFile = path.join("receipts", "DG2451.json"); // you should map dynamically
    if (fs.existsSync(receiptFile)) {
        const data = JSON.parse(fs.readFileSync(receiptFile));
        data.mpesa = mpesaCode;

        // Save updated receipt
        fs.writeFileSync(receiptFile, JSON.stringify(data));

        // Prepare SMS message
        const downloadLink = `https://yourdomain.com/receipts/${data.receipt}.pdf`;
        const message = `Digitech Fitness & Wellness Lab\nPayment Received ✅\nAmount: KSh ${data.amount}\nMembership: ${data.plan}\nDownload Receipt: ${downloadLink}\nWhere Sweat Writes Success • Grind • Grow • Glow`;

        // Send SMS
        await sendSMS(data.phone, message);
    }

    res.sendStatus(200);
});
