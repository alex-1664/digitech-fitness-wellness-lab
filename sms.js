const axios = require("axios");

async function sendSMS(phone, message) {
    try {
        // Safaricom Daraja SMS endpoint (for sandbox)
        const smsUrl = "https://sandbox.safaricom.co.ke/mpesa/sms/v1/send";

        // Access Token (same as MPESA access token)
        const token = await getAccessToken(); // use your existing function

        // Make POST request
        const response = await axios.post(
            smsUrl,
            {
                ShortCode: process.env.SHORTCODE,  // your shortcode
                Message: message,
                Msisdn: phone
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("SMS sent:", response.data);
    } catch (err) {
        console.log("SMS failed:", err.message);
    }
}

module.exports = { sendSMS };
