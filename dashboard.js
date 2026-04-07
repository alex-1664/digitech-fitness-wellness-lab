document.addEventListener("DOMContentLoaded", function(){

// ================= DATA =================
let members = JSON.parse(localStorage.getItem("members")) || [];

// ================= SAVE =================
function saveData(){
  localStorage.setItem("members", JSON.stringify(members));
}

// ================= RENDER =================
function renderTable(){
  const tbody = document.getElementById("membersBody");
  tbody.innerHTML = "";

  members.forEach((m, i)=>{
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${m.name}</td>
      <td>${m.id}</td>
      <td>${m.phone}</td>
      <td>${m.gender}</td>
      <td>${m.plan}</td>
      <td>${m.weights[0]?.weight || ""}</td>
      <td>
        <button onclick="deleteMember(${i})" class="text-red-500">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// ================= ADD =================
document.getElementById("addMemberForm").onsubmit = function(e){
  e.preventDefault();

  const member = {
    name: memberName.value,
    id: memberID.value,
    phone: memberPhone.value,
    gender: memberGender.value,
    plan: memberPlan.value,
    regFee: memberRegFee.value,
    membershipFee: memberMembershipFee.value,
    regDate: memberRegDate.value,
    emergencyName: emergencyName.value,
    emergencyPhone: emergencyPhone.value,
    weights: [{
      date: memberRegDate.value,
      weight: memberWeight.value
    }]
  };

  members.push(member);
  saveData();
  renderTable();
  this.reset();
};

// ================= DELETE =================
window.deleteMember = function(i){
  members.splice(i,1);
  saveData();
  renderTable();
};

// ================= LOGOUT =================
window.logout = function(){
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
};

// INIT
renderTable();

});
