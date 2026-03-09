app.post("/login", async (req,res)=>{
  const {username, password} = req.body
  const user = users.find(u => u.username === username)
  if(!user) return res.json({success:false, message:"User not found"})

  const valid = await bcrypt.compare(password, user.password)
  if(valid){
    req.session.user = {username: user.username, role: user.role}
    return res.json({success:true})
  }else{
    return res.json({success:false, message:"Wrong password"})
  }
})
