const axios = require("axios")
const { CONSUMER_KEY, CONSUMER_SECRET, SHORTCODE } = process.env

async function getAccessToken() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")
  const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
  const res = await axios.get(url, { headers: { Authorization: `Basic ${auth}` } })
  return res.data.access_token
}

async function sendSMS(phone, message){
  const token = await getAccessToken()
  // Use Safaricom API (C2B) or a simulated SMS endpoint
  console.log(`Sending SMS to ${phone}: ${message}`)
}

module.exports = sendSMS
