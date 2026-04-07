let members = [];

// ================= LOAD =================
async function loadMembers(){
  const res = await fetch("/members");
  members = await res.json();
  renderTable();
}

// ================= DASHBOARD =================
function updateDashboard() {
  document.getElementById('totalMembers').textContent = members.length;

  const totalReg = members.reduce((s,m)=>s+Number(m.regFee||0),0);
  const totalMembership = members.reduce((s,m)=>s+Number(m.membershipFee||0),0);

  document.getElementById('totalRegFees').textContent = `Ksh ${totalReg}`;
  document.getElementById('totalMembershipFees').textContent = `Ksh ${totalMembership}`;
}

// ================= TABLE =================
function renderTable() {
  const tbody = document.getElementById('membersBody');
  tbody.innerHTML = '';

  members.forEach((m) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${m.name}</td>
      <td>${m.id}</td>
      <td>${m.phone}</td>
      <td>${m.gender || ''}</td>
      <td>${m.plan}</td>
      <td>${m.regFee}</td>
      <td>${m.membershipFee}</td>
      <td>${m.regDate || ''}</td>
      <td>${m.emergencyName || ''}</td>
      <td>${m.emergencyPhone || ''}</td>
      <td>${m.weights?.slice(-1)[0]?.weight || ''}</td>
      <td>
        <button onclick="editMember('${m.id}')">Edit</button>
        <button onclick="deleteMember('${m.id}')">Delete</button>
        <button onclick="openWeightModal('${m.id}')">Weight</button>
        <button onclick="viewWeightChart('${m.id}')">Progress</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  updateDashboard();
}

// ================= DELETE =================
async function deleteMember(id){
  if(confirm("Delete member?")){
    await fetch(`/delete-member/${id}`, { method: "DELETE" });
    loadMembers();
  }
}

// ================= EDIT =================
let currentEditId = null;

function editMember(id){
  const m = members.find(x => x.id === id);
  currentEditId = id;

  document.getElementById('editMemberName').value = m.name;
  document.getElementById('editMemberPhone').value = m.phone;

  document.getElementById('editModal').classList.remove('hidden');
}

document.getElementById('editMemberForm').onsubmit = async (e)=>{
  e.preventDefault();

  const updated = {
    name: document.getElementById('editMemberName').value,
    phone: document.getElementById('editMemberPhone').value
  };

  await fetch(`/update-member/${currentEditId}`, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(updated)
  });

  loadMembers();
  document.getElementById('editModal').classList.add('hidden');
};

// ================= WEIGHT =================
let weightId = null;

function openWeightModal(id){
  weightId = id;
  document.getElementById('weightModal').classList.remove('hidden');
}

document.getElementById('weightForm').onsubmit = async (e)=>{
  e.preventDefault();

  const data = {
    date: document.getElementById('weightDate').value,
    weight: Number(document.getElementById('newWeight').value)
  };

  await fetch(`/update-weight/${weightId}`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });

  alert("Weight updated");
  loadMembers();
  document.getElementById('weightModal').classList.add('hidden');
};

// ================= CHART =================
function viewWeightChart(id){
  const m = members.find(x => x.id === id);

  if(!m.weights || m.weights.length === 0){
    alert("No data");
    return;
  }

  const ctx = document.getElementById('paymentsChart').getContext('2d');

  new Chart(ctx,{
    type:'line',
    data:{
      labels:m.weights.map(w=>w.date),
      datasets:[{label:'Weight', data:m.weights.map(w=>w.weight)}]
    }
  });
}

// ================= INIT =================
loadMembers();
