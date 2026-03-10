const axios = require("axios")

async function sendSMS(phone, message){
  try{
    await axios.post("SMS_API_URL",{
      phone,
      message
    })
    console.log("SMS sent to", phone)
  }catch(err){
    console.log("SMS Error:", err)
  }
}

module.exports = sendSMS
