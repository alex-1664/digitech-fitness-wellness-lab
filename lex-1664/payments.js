async function pay(){

const phone = document.getElementById("phone").value
const amount = document.getElementById("amount").value

document.getElementById("status").innerText="Sending STK Push..."

const response = await fetch("http://localhost:3000/pay",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
phone:phone,
amount:amount
})

})

const data = await response.json()

document.getElementById("status").innerText="Check your phone and enter MPESA PIN"

console.log(data)

}
