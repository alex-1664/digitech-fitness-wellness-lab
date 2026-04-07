const express = require("express")
const router = express.Router()

let members = [] // should later come from DB

router.get("/", (req, res) => {

    let totalMembers = members.length
    let totalRevenue = 0
    let totalRegFees = 0
    let gymRevenue = 0

    members.forEach(m => {
        const amount = Number(m.amount || 0)
        const regFee = Number(m.regFee || 0)

        totalRevenue += amount
        totalRegFees += regFee
        gymRevenue += (amount - regFee)
    })

    res.json({
        totalMembers,
        totalRevenue,
        totalRegFees,
        gymRevenue
    })
})

module.exports = router
