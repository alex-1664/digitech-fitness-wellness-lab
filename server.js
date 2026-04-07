const express = require("express")
const fs = require("fs")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const FILE = "members.json"

function getMembers() {
    if (!fs.existsSync(FILE)) return []
    return JSON.parse(fs.readFileSync(FILE))
}

function saveMembers(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

app.post("/add-member", (req, res) => {
    const members = getMembers()
    members.push(req.body)
    saveMembers(members)
    res.json({ message: "Member saved" })
})

app.get("/members", (req, res) => {
    res.json(getMembers())
})

app.listen(PORT, () => {
    console.log("Server running on port " + PORT)
})
