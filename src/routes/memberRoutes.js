const express = require("express")
const router = express.Router()

let members = [] // temporary (later connect DB)

// ADD MEMBER
router.post("/add", (req, res) => {
    const member = req.body

    // Prevent duplicates
    const exists = members.find(
        m => m.id === member.id || m.phone === member.phone
    )

    if (exists) {
        return res.status(400).json({
            message: "Member with same ID or phone already exists"
        })
    }

    members.push(member)

    res.json({
        message: "Member added successfully",
        member
    })
})

// GET MEMBERS
router.get("/", (req, res) => {
    res.json(members)
})

module.exports = router
