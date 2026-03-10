const generateQR = require("../utils/generateQR")

async function registerMember(req,res){

const {name,phone} = req.body

const memberId = "DG" + Math.floor(Math.random()*10000)

const qrCode = await generateQR(memberId)

const member = {

id:memberId,
name:name,
phone:phone,
qr:qrCode

}

members.push(member)

res.json(member)

}

module.exports = {registerMember}
