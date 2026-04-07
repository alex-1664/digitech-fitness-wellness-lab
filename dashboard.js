// ====== MEMBERS DATA ======
let members = JSON.parse(localStorage.getItem("members")) || [];

// ====== DASHBOARD SUMMARY ======
function updateDashboard() {
  document.getElementById('totalMembers').textContent = members.length;

  const totalReg = members.reduce((s, m) => s + Number(m.regFee || 0), 0);
  const totalMembership = members.reduce((s, m) => s + Number(m.membershipFee || 0), 0);

  document.getElementById('totalRegFees').textContent = `Ksh ${totalReg}`;
  document.getElementById('totalMembershipFees').textContent = `Ksh ${totalMembership}`;
}

// ====== TABLE RENDER ======
function renderTable() {
  const tbody = document.getElementById('membersBody');
  tbody.innerHTML = '';

  members.forEach((m, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${m.name}</td>
      <td>${m.id}</td>
      <td>${m.phone}</td>
      <td>${m.emergencyName}</td>
      <td>${m.emergencyPhone}</td>
      <td>${m.weights?.slice(-1)[0]?.weight || ''}</td>
      <td>${m.plan}</td>
      <td>${m.regFee}</td>
      <td>${m.membershipFee}</td>
      <td>${m.regDate}</td>
      <td>
        <button onclick="openWeightModal(${idx})">Weight</button>
        <button onclick="deleteMember(${idx})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateDashboard();
  renderCharts();
}

// ====== ADD MEMBER ======
function addMember(member) {
  if (members.some(m => m.id === member.id)) {
    alert("Member already exists!");
    return;
  }
  members.push(member);
  localStorage.setItem("members", JSON.stringify(members));
  renderTable();
}

// ====== DELETE MEMBER ======
function deleteMember(idx) {
  if (confirm("Delete member?")) {
    members.splice(idx, 1);
    localStorage.setItem("members", JSON.stringify(members));
    renderTable();
  }
}

// ====== WEIGHT MODAL ======
let weightIndex = null;
const weightModal = document.getElementById("weightModal");

function openWeightModal(idx) {
  weightIndex = idx;
  weightModal.classList.remove("hidden");
}

document.getElementById("closeWeightModal").onclick = () => {
  weightModal.classList.add("hidden");
};

document.getElementById("weightForm").onsubmit = (e) => {
  e.preventDefault();
  const date = document.getElementById("weightDate").value;
  const weight = Number(document.getElementById("newWeight").value);
  if (!members[weightIndex].weights) members[weightIndex].weights = [];
  members[weightIndex].weights.push({ date, weight });
  localStorage.setItem("members", JSON.stringify(members));
  weightModal.classList.add("hidden");
  renderTable();
};

// ====== CHART ======
function renderCharts() {
  const planCounts = { Daily: 0, Weekly: 0, Monthly: 0 };
  members.forEach(m => { if (planCounts[m.plan] !== undefined) planCounts[m.plan]++; });

  const ctx = document.getElementById("planChart").getContext("2d");
  if (window.planChart) window.planChart.destroy();
  window.planChart = new Chart(ctx, {
    type: 'pie',
    data: { labels: Object.keys(planCounts), datasets: [{ data: Object.values(planCounts) }] }
  });
}

// ====== INITIALIZE ======
renderTable();
