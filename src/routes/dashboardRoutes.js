// MEMBERS DATA
let members = [];

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

  members.forEach((m, idx) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td class="px-4 py-2">${m.name}</td>
      <td class="px-4 py-2">${m.id}</td>
      <td class="px-4 py-2">${m.phone}</td>
      <td class="px-4 py-2">${m.gender}</td>
      <td class="px-4 py-2">${m.plan}</td>
      <td class="px-4 py-2">${m.regFee}</td>
      <td class="px-4 py-2">${m.membershipFee}</td>
      <td class="px-4 py-2">${m.regDate}</td>
      <td class="px-4 py-2">${m.emergencyName}</td>
      <td class="px-4 py-2">${m.emergencyPhone}</td>
      <td class="px-4 py-2">${m.weights?.slice(-1)[0]?.weight || ''}</td>
      <td class="px-4 py-2">
        <button onclick="editMember(${idx})" class="text-blue-500">Edit</button>
        <button onclick="deleteMember(${idx})" class="text-red-500 ml-2">Delete</button>
        <button onclick="openWeightModal(${idx})" class="text-green-500 ml-2">Weight</button>
        <button onclick="viewWeightChart(${idx})" class="text-purple-500 ml-2">Progress</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  updateDashboard();
  renderCharts();
}

// ================= ADD MEMBER =================
const addModal = document.getElementById('addModal');
const openAddModal = document.getElementById('openAddModal');
const closeAddModal = document.getElementById('closeAddModal');
const addMemberForm = document.getElementById('addMemberForm');

openAddModal.onclick = ()=> addModal.classList.remove('hidden');
closeAddModal.onclick = ()=> addModal.classList.add('hidden');

addMemberForm.onsubmit = (e)=>{
  e.preventDefault();

  const member = {
    name: document.getElementById('memberName').value.trim(),
    id: document.getElementById('memberID').value.trim(),
    phone: document.getElementById('memberPhone').value.trim(),
    gender: document.getElementById('memberGender').value,
    plan: document.getElementById('memberPlan').value,
    regFee: Number(document.getElementById('memberRegFee').value),
    membershipFee: Number(document.getElementById('memberMembershipFee').value),
    regDate: document.getElementById('memberRegDate').value,
    emergencyName: document.getElementById('emergencyName').value.trim(),
    emergencyPhone: document.getElementById('emergencyPhone').value.trim(),
    weights: [
      {
        date: document.getElementById('memberRegDate').value,
        weight: Number(document.getElementById('memberWeight').value)
      }
    ]
  };

  if(members.some(m=>m.id===member.id)){
    alert('Member already exists!');
    return;
  }

  members.push(member);
  renderTable();

  addMemberForm.reset();
  addModal.classList.add('hidden');
};

// ================= EDIT MEMBER =================
let editIndex = null;
const editModal = document.getElementById('editModal');

function editMember(idx){
  editIndex = idx;
  const m = members[idx];

  document.getElementById('editMemberName').value = m.name;
  document.getElementById('editMemberID').value = m.id;
  document.getElementById('editMemberPhone').value = m.phone;
  document.getElementById('editMemberGender').value = m.gender;
  document.getElementById('editMemberPlan').value = m.plan;
  document.getElementById('editMemberRegFee').value = m.regFee;
  document.getElementById('editMemberMembershipFee').value = m.membershipFee;
  document.getElementById('editMemberRegDate').value = m.regDate;
  document.getElementById('editEmergencyName').value = m.emergencyName;
  document.getElementById('editEmergencyPhone').value = m.emergencyPhone;

  editModal.classList.remove('hidden');
}

document.getElementById('closeEditModal').onclick = ()=> editModal.classList.add('hidden');

document.getElementById('editMemberForm').onsubmit = (e)=>{
  e.preventDefault();

  const m = members[editIndex];

  const newId = document.getElementById('editMemberID').value.trim();

  if(members.some((x,i)=>x.id===newId && i!==editIndex)){
    alert('Duplicate ID!');
    return;
  }

  m.name = document.getElementById('editMemberName').value.trim();
  m.id = newId;
  m.phone = document.getElementById('editMemberPhone').value.trim();
  m.gender = document.getElementById('editMemberGender').value;
  m.plan = document.getElementById('editMemberPlan').value;
  m.regFee = Number(document.getElementById('editMemberRegFee').value);
  m.membershipFee = Number(document.getElementById('editMemberMembershipFee').value);
  m.regDate = document.getElementById('editMemberRegDate').value;
  m.emergencyName = document.getElementById('editEmergencyName').value.trim();
  m.emergencyPhone = document.getElementById('editEmergencyPhone').value.trim();

  renderTable();
  editModal.classList.add('hidden');
};

// ================= DELETE =================
function deleteMember(idx){
  if(confirm('Delete member?')){
    members.splice(idx,1);
    renderTable();
  }
}

// ================= WEIGHT =================
let weightIndex = null;
const weightModal = document.getElementById('weightModal');

function openWeightModal(idx){
  weightIndex = idx;
  weightModal.classList.remove('hidden');
}

document.getElementById('closeWeightModal').onclick = ()=> weightModal.classList.add('hidden');

document.getElementById('weightForm').onsubmit = (e)=>{
  e.preventDefault();

  const date = document.getElementById('weightDate').value;
  const weight = Number(document.getElementById('newWeight').value);

  members[weightIndex].weights.push({date,weight});

  alert('Weight updated!');
  weightModal.classList.add('hidden');
  renderTable();
};

// ================= CHARTS =================
function renderCharts(){
  const planCounts = {Daily:0,Weekly:0,Monthly:0};
  members.forEach(m=>{if(planCounts[m.plan]!==undefined) planCounts[m.plan]++;});

  const ctx = document.getElementById('planChart').getContext('2d');
  new Chart(ctx,{
    type:'pie',
    data:{labels:Object.keys(planCounts),datasets:[{data:Object.values(planCounts)}]}
  });
}

// ================= WEIGHT CHART =================
function viewWeightChart(idx){
  const m = members[idx];
  if(!m.weights.length){ alert('No data'); return;}

  const ctx = document.getElementById('paymentsChart').getContext('2d');

  new Chart(ctx,{
    type:'line',
    data:{
      labels:m.weights.map(w=>w.date),
      datasets:[{label:'Weight (kg)',data:m.weights.map(w=>w.weight)}]
    }
  });
}

// ================= INIT =================
renderTable();
