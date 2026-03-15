const express = require("express")
const router = express.Router()
const fs = require("fs")
const path = require("path")

const paymentsFile = path.join(__dirname,"../data/payments.json")
const receiptsFolder = path.join(__dirname,"../receipts")

router.post("/pay",(req,res)=>{

  const {memberId,phone,amount} = req.body

  const paymentId = Date.now()

  let payments = JSON.parse(fs.readFileSync(paymentsFile))

  payments.push({
    id:paymentId,
    memberId,
    phone,
    amount,
    status:"paid",
    time:new Date()
  })

  fs.writeFileSync(paymentsFile,JSON.stringify(payments,null,2))

  const receiptPath = path.join(receiptsFolder,`DG${paymentId}.pdf`)

  fs.writeFileSync(receiptPath,
`Digitech Fitness Receipt
Member ID: ${memberId}
Amount: ${amount}
Date: ${new Date()}
`)

  res.json({
    message:"Payment recorded",
    receipt:`/receipts/DG${paymentId}.pdf`
  })

})

module.exports = router
