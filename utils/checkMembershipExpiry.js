const sendSMS = require("./renewalReminder")

function checkMembershipExpiry(members){

const today = new Date()

members.forEach(member => {

const expiry = new Date(member.membershipExpiry)

const daysLeft = (expiry - today) / (1000*60*60*24)

if(daysLeft <= 3 && daysLeft > 0){

sendSMS(member.phone, member.name)

}

})

}

module.exports = checkMembershipExpiry
