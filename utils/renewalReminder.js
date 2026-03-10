const axios = require("axios")

async function sendSMS(phone, name){

const message = `Hello ${name}, your Digitech Fitness membership is about to expire. Renew today via M-PESA to continue enjoying our gym services.`

try{

await axios.post("SMS_API_URL",{
phone: phone,
message: message
})

console.log("Reminder sent to", phone)

}catch(err){

console.log("SMS error", err)

}

}

module.exports = sendSMS
