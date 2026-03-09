let members = JSON.parse(localStorage.getItem("members")) || [];

let table = document.querySelector("#membersTable tbody");

members.forEach(member => {

let row = table.insertRow();

row.insertCell(0).textContent = member.name;
row.insertCell(1).textContent = member.phone;
row.insertCell(2).textContent = member.gender;
row.insertCell(3).textContent = member.age;
row.insertCell(4).textContent = member.weight;
row.insertCell(5).textContent = member.plan;
row.insertCell(6).textContent = member.date;

});
