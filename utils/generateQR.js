const QRCode = require("qrcode")
const path = require("path")
const fs = require("fs")

const folder = path.join(__dirname,"../public/qrcodes")

if(!fs.existsSync(folder)){
  fs.mkdirSync(folder)
}

async function generateQR(memberId){

  const file = path.join(folder,`member-${memberId}.png`)

  await QRCode.toFile(file,String(memberId))

  return `/qrcodes/member-${memberId}.png`
}

module.exports = generateQR
