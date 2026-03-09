const express = require("express")
const app = express()

app.use(express.static("."))

app.get("/", (req,res)=>{
res.send("Digitech Fitness System Running")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
console.log("Server running on port", PORT)
})
