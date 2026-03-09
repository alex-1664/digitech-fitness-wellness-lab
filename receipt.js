function generateReceipt(data){

document.getElementById("receipt").innerText = data.receipt
document.getElementById("name").innerText = data.name
document.getElementById("phone").innerText = data.phone
document.getElementById("plan").innerText = data.plan
document.getElementById("amount").innerText = "KSh " + data.amount
document.getElementById("date").innerText = new Date().toLocaleDateString()
document.getElementById("mpesa").innerText = data.mpesa

}
