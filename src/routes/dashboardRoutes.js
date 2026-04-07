// Members array
let members = [
  {name:'Alex Kiio',id:'12345',phone:'0701055560',plan:'Monthly',regFee:400,membershipFee:1500,regDate:'2026-04-07'},
  {name:'Mary Wanjiku',id:'12346',phone:'0712345678',plan:'Weekly',regFee:400,membershipFee:500,regDate:'2026-04-06'},
];

// Update dashboard summary cards
function updateDashboard() {
  document.getElementById('totalMembers').textContent = members.length;
  const totalReg = members.reduce((sum,m)=>sum+Number(m.regFee||0),0);
  const totalMembership = members.reduce((sum,m)=>sum+Number(m.membershipFee||0),0);
  document.getElementById('totalRegFees').textContent = `Ksh ${totalReg}`;
  document.getElementById('totalMembershipFees').textContent = `Ksh ${totalMembership}`;
}

// Render members table
function renderTable() {
  const tbody = document.getElementById('membersBody');
  tbody.innerHTML = '';
  members.forEach((m, idx)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-4 py-2">${m.name}</td>
      <td class="px-4 py-2">${m.id}</td>
      <td class="px-4 py-2">${m.phone}</td>
      <td class="px-4 py-2">${m.plan}</td>
      <td class="px-4 py-2">${m.regFee}</td>
      <td class="px-4 py-2">${m.membershipFee}</td>
      <td class="px-4 py-2">${m.regDate}</td>
      <td class="px-4 py-2">
        <button onclick="editMember(${idx})" class="text-blue-500">Edit</button>
        <button onclick="deleteMember(${idx})" class="text-red-500 ml-2">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  updateDashboard();
  renderCharts();
}

// Charts
function renderCharts(){
  const planCounts = {Daily:0,Weekly:0,Monthly:0};
  members.forEach(m=>{if(planCounts[m.plan]!==undefined) planCounts[m.plan]++;});

  const planCtx = document.getElementById('planChart').getContext('2d');
  new Chart(planCtx,{type:'pie',data:{labels:Object.keys(planCounts),datasets:[{data:Object.values(planCounts),backgroundColor:['#3b82f6','#8b5cf6','#f59e0b']}]},options:{responsive:true,plugins:{legend:{position:'bottom'}}}});

  const totalReg = members.reduce((sum,m)=>sum+Number(m.regFee||0),0);
  const totalMembership = members.reduce((sum,m)=>sum+Number(m.membershipFee||0),0);
  const paymentCtx = document.getElementById('paymentsChart').getContext('2d');
  new Chart(paymentCtx,{type:'bar',data:{labels:['Registration Fees','Membership Fees'],datasets:[{label:'Ksh',data:[totalReg,totalMembership],backgroundColor:['#10b981','#f59e0b']}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});
}

// Search
document.getElementById('searchInput').addEventListener('input', e=>{
  const query = e.target.value.toLowerCase();
  renderTable();
  // Filtering can be added later
});

// CSV/PDF placeholders
function exportCSV(){alert('Export CSV coming soon!');}
function exportPDF(){alert('Export PDF coming soon!');}

// Edit/Delete placeholders
function editMember(idx){alert('Edit member: '+members[idx].name);}
function deleteMember(idx){if(confirm('Delete '+members[idx].name+'?')){members.splice(idx,1);renderTable();}}

// Active sidebar highlight
document.querySelectorAll('.sidebar-link').forEach(link=>{
  if(link.textContent.trim() === 'Dashboard') link.classList.add('bg-green-100','font-bold');
});

// Add Member Modal
const addModal = document.getElementById('addModal');
const openAddModal = document.getElementById('openAddModal');
const closeAddModal = document.getElementById('closeAddModal');
const addMemberForm = document.getElementById('addMemberForm');

openAddModal.addEventListener('click',()=>addModal.classList.remove('hidden'));
closeAddModal.addEventListener('click',()=>addModal.classList.add('hidden'));
addMemberForm.addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('memberName').value.trim();
  const id=document.getElementById('memberID').value.trim();
  const phone=document.getElementById('memberPhone').value.trim();
  const plan=document.getElementById('memberPlan').value;
  const regFee=Number(document.getElementById('memberRegFee').value);
  const membershipFee=Number(document.getElementById('memberMembershipFee').value);
  const regDate=document.getElementById('memberRegDate').value;

  if(members.some(m=>m.id===id)){alert('Member with this ID already exists!'); return;}

  members.push({name,id,phone,plan,regFee,membershipFee,regDate});
  renderTable();
  addMemberForm.reset();
  addModal.classList.add('hidden');
});

// Initial render
renderTable();
