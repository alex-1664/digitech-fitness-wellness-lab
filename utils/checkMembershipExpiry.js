const sendSMS = require("./sms")

function checkMembershipExpiry(members){
  const today = new Date()
  members.forEach(member=>{
    const expiry = new Date(member.membershipExpiry)
    const daysLeft = (expiry - today)/(1000*60*60*24)
    if(daysLeft <=3 && daysLeft>0){
      const msg = `Hello ${member.name}, your membership expires in ${Math.ceil(daysLeft)} day(s). Renew via M-PESA today!`
      sendSMS(member.phone, msg)
    }
  })
}

module.exports = checkMembershipExpiry
