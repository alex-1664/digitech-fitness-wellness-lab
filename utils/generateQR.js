const QRCode = require("qrcode")
const path = require("path")

async function generateQR(memberId){
  const qrPath = path.join(__dirname,"../public/qrcodes",memberId + ".png")
  await QRCode.toFile(qrPath, memberId)
  return "/qrcodes/" + memberId + ".png"
}

module.exports = generateQR
