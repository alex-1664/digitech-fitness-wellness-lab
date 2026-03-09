document.getElementById("memberForm").addEventListener("submit", function(e) {

e.preventDefault();

let member = {
name: document.getElementById("name").value,
phone: document.getElementById("phone").value,
gender: document.getElementById("gender").value,
age: document.getElementById("age").value,
weight: document.getElementById("weight").value,
plan: document.getElementById("plan").value,
date: new Date().toLocaleDateString()
};

let members = JSON.parse(localStorage.getItem("members")) || [];

members.push(member);

localStorage.setItem("members", JSON.stringify(members));

alert("Member Registered Successfully");

document.getElementById("memberForm").reset();

});
