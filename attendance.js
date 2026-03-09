let attendance = JSON.parse(localStorage.getItem("attendance")) || []

const table = document.querySelector("#attendanceTable tbody")

function loadAttendance(){

table.innerHTML=""

attendance.forEach(record=>{

let row = table.insertRow()

row.insertCell(0).textContent = record.member
row.insertCell(1).textContent = record.date
row.insertCell(2).textContent = record.time

})

}

loadAttendance()

function recordAttendance(memberID){

const now = new Date()

const record = {

member: memberID,
date: now.toLocaleDateString(),
time: now.toLocaleTimeString()

}

attendance.push(record)

localStorage.setItem("attendance",JSON.stringify(attendance))

loadAttendance()

alert("Check-in successful for "+memberID)

}

Quagga.init({

inputStream:{
name:"Live",
type:"LiveStream",
target:document.querySelector('#scanner')
},

decoder:{
readers:["code_128_reader","ean_reader"]
}

},

function(err){

if(err){
console.log(err)
return
}

Quagga.start()

})

Quagga.onDetected(function(data){

let code = data.codeResult.code

recordAttendance(code)

})
