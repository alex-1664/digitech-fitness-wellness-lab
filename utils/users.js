const bcrypt = require("bcrypt")

// Example users array
let users = []

// Add a default admin
(async ()=>{
  const hashedPassword = await bcrypt.hash("1234alex",10)
  users.push({
    username:"admin",
    password:hashedPassword
  })
})()

module.exports = users
