const express = require("express")
const router = express.Router()

// Simple AI assistant logic (can be replaced with API later)
router.post("/ask", (req,res)=>{
    const {question} = req.body

    if(!question) return res.json({answer:"Please ask a question."})

    const q = question.toLowerCase()

    let answer = "Sorry, I don't have an answer for that yet."

    if(q.includes("workout") || q.includes("exercise")){
        answer = "Try 30 minutes of cardio and strength training 3-4 times a week."
    } else if(q.includes("diet") || q.includes("nutrition")){
        answer = "Eat a balanced diet: protein, carbs, healthy fats, and lots of water."
    } else if(q.includes("weight loss")){
        answer = "Focus on a caloric deficit and regular exercise. Stay consistent!"
    } else if(q.includes("muscle gain")){
        answer = "Increase protein intake and do strength training progressively."
    }

    res.json({answer})
})

module.exports = router
