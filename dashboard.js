document.addEventListener("DOMContentLoaded", function(){

let members = JSON.parse(localStorage.getItem("members")) || [];
let selectedIndex = null;

// SAVE
function saveData(){
  localStorage.setItem("members", JSON.stringify(members));
}

// RENDER TABLE
function renderTable(){
  const tbody = document.getElementById("membersBody");
  tbody.innerHTML = "";

  members.forEach((m, i)=>{
    const latestWeight = m.weights[m.weights.length-1]?.weight || "";

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${m.name}</td>
      <td>${m.id}</td>
      <td>${m.phone}</td>
      <td>${m.plan}</td>
      <td>${latestWeight}</td>
      <td>
        <button onclick="editMember(${i})" class="text-blue-500">Edit</button>
        <button onclick="deleteMember(${i})" class="text-red-500 ml-2">Delete</button>
        <button onclick="addWeight(${i})" class="text-green-500 ml-2">Weight</button>
        <button onclick="showChart(${i})" class="text-purple-500 ml-2">Chart</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// ADD MEMBER
document.getElementById("addMemberForm").onsubmit = function(e){
  e.preventDefault();

  const member = {
    name: memberName.value,
    id: memberID.value,
    phone: memberPhone.value,
    gender: memberGender.value,
    plan: memberPlan.value,
    regDate: memberRegDate.value,
    weights: [{
      date: memberRegDate.value,
      weight: Number(memberWeight.value)
    }]
  };

  members.push(member);
  saveData();
  renderTable();
  this.reset();
};

// DELETE
window.deleteMember = function(i){
  members.splice(i,1);
  saveData();
  renderTable();
};

// EDIT
window.editMember = function(i){
  const m = members[i];

  memberName.value = m.name;
  memberID.value = m.id;
  memberPhone.value = m.phone;
  memberPlan.value = m.plan;

  selectedIndex = i;
};

// UPDATE (when editing)
document.getElementById("addMemberForm").addEventListener("submit", function(e){
  if(selectedIndex !== null){
    e.preventDefault();

    members[selectedIndex].name = memberName.value;
    members[selectedIndex].phone = memberPhone.value;
    members[selectedIndex].plan = memberPlan.value;

    selectedIndex = null;

    saveData();
    renderTable();
    this.reset();
  }
});

// ADD WEEKLY WEIGHT
window.addWeight = function(i){
  const weight = prompt("Enter new weight (kg):");
  if(!weight) return;

  members[i].weights.push({
    date: new Date().toISOString().split('T')[0],
    weight: Number(weight)
  });

  saveData();
  renderTable();
};

// SHOW CHART
let chart;
window.showChart = function(i){
  const m = members[i];

  const dates = m.weights.map(w=>w.date);
  const weights = m.weights.map(w=>w.weight);

  const ctx = document.getElementById("weightChart");

  if(chart) chart.destroy();

  chart = new Chart(ctx,{
    type:"line",
    data:{
      labels:dates,
      datasets:[{
        label:"Weight (kg)",
        data:weights
      }]
    }
  });
};

// LOGOUT
window.logout = function(){
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
};

// INIT
renderTable();

});
