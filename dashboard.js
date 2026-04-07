document.addEventListener("DOMContentLoaded", function(){

let members = JSON.parse(localStorage.getItem("members")) || [];
let selectedIndex = null;
let chart;

// SAVE DATA
function saveData(){
  localStorage.setItem("members", JSON.stringify(members));
}

// RENDER TABLE
function renderTable(){
  const tbody = document.getElementById("membersBody");
  tbody.innerHTML = "";

  members.forEach((m,i)=>{
    const latestWeight = m.weights[m.weights.length-1]?.weight || "";

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${m.name}</td>
      <td>${m.id}</td>
      <td>${m.phone}</td>
      <td>${m.plan}</td>
      <td>${latestWeight}</td>
      <td>${m.emergencyName}</td>
      <td>${m.emergencyPhone}</td>
      <td>
        <button onclick="editMember(${i})" class="text-blue-500">Edit</button>
        <button onclick="deleteMember(${i})" class="text-red-500 ml-1">Delete</button>
        <button onclick="addWeight(${i})" class="text-green-500 ml-1">Weight</button>
        <button onclick="showChart(${i})" class="text-purple-500 ml-1">Chart</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// ADD MEMBER
document.getElementById("addMemberForm").onsubmit = function(e){
  e.preventDefault();

  if(selectedIndex !== null){
    // UPDATE EXISTING
    members[selectedIndex].name = memberName.value;
    members[selectedIndex].phone = memberPhone.value;
    members[selectedIndex].plan = memberPlan.value;
    members[selectedIndex].emergencyName = emergencyName.value;
    members[selectedIndex].emergencyPhone = emergencyPhone.value;

    selectedIndex = null;
  } else {
    // ADD NEW
    members.push({
      name: memberName.value,
      id: memberID.value,
      phone: memberPhone.value,
      gender: memberGender.value,
      plan: memberPlan.value,
      regDate: memberRegDate.value,
      weights:[{date: memberRegDate.value, weight: Number(memberWeight.value)}],
      emergencyName: emergencyName.value,
      emergencyPhone: emergencyPhone.value
    });
  }

  saveData();
  renderTable();
  this.reset();
};

// DELETE MEMBER
window.deleteMember = function(i){
  members.splice(i,1);
  saveData();
  renderTable();
};

// EDIT MEMBER
window.editMember = function(i){
  const m = members[i];
  memberName.value = m.name;
  memberID.value = m.id;
  memberPhone.value = m.phone;
  memberPlan.value = m.plan;
  emergencyName.value = m.emergencyName;
  emergencyPhone.value = m.emergencyPhone;
  selectedIndex = i;
};

// ADD WEEKLY WEIGHT
window.addWeight = function(i){
  const w = prompt("Enter new weight (kg):");
  if(!w) return;

  members[i].weights.push({date: new Date().toISOString().split("T")[0], weight: Number(w)});
  saveData();
  renderTable();
};

// SHOW CHART
window.showChart = function(i){
  const m = members[i];
  const dates = m.weights.map(w=>w.date);
  const weights = m.weights.map(w=>w.weight);

  const ctx = document.getElementById("weightChart");

  if(chart) chart.destroy();

  chart = new Chart(ctx,{
    type:"line",
    data:{labels:dates,datasets:[{label:"Weight (kg)",data:weights,borderColor:"blue",fill:false}]},
    options:{responsive:true,scales:{y:{beginAtZero:true}}}
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
