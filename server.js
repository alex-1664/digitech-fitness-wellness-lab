const users = require("./utils/users")
const bcrypt = require("bcrypt")

app.use(express.json())

app.post("/login", async (req,res)=>{
  const {username, password} = req.body

  const user = users.find(u => u.username === username)
  if(!user){
    return res.json({success:false, message:"User not found"})
  }

  const valid = await bcrypt.compare(password, user.password)
  if(valid){
    return res.json({success:true, message:"Login successful"})
  }else{
    return res.json({success:false, message:"Wrong password"})
  }
})
