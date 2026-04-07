let membersData = [];

async function loadDashboard(){
  try {
    const res = await axios.get('/api/members');
    membersData = res.data;

    // Summary Cards
    animateCount('totalMembers', membersData.length);
    animateCount('totalRegFees', membersData.reduce((sum,m)=>sum+Number(m.registrationFee),0));
    animateCount('totalMembershipFees', membersData.reduce((sum,m)=>sum+Number(m.membershipFee),0));

    renderTable(membersData);
    renderCharts();
  } catch(err){
    console.error(err);
  }
}

function renderTable(data){
  const tbody = document.getElementById('membersBody');
  tbody.innerHTML = '';
  data.forEach(m => {
    tbody.innerHTML += `
      <tr>
        <td class="px-4 py-2">${m.fullName}</td>
        <td class="px-4 py-2">${m.idNumber}</td>
        <td class="px-4 py-2">${m.phone}</td>
        <td class="px-4 py-2">${m.plan}</td>
        <td class="px-4 py-2">${m.registrationFee}</td>
        <td class="px-4 py-2">${m.membershipFee}</td>
        <td class="px-4 py-2">${m.registrationDate}</td>
        <td class="px-4 py-2">
          <button onclick="editMember(${m.id})" class="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500">Edit</button>
          <button onclick="deleteMember(${m.id})" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
        </td>
      </tr>`;
  });
}

// ------------------- Edit/Delete -------------------
async function editMember(id){
  const member = membersData.find(m=>m.id===id);
  const newName = prompt("Edit Name", member.fullName);
  if(!newName) return;
  const newPhone = prompt("Edit Phone", member.phone);
  const newPlan = prompt("Edit Plan (Daily/Weekly/Monthly)", member.plan);
  const newMembershipFee = prompt("Edit Membership Fee", member.membershipFee);
  try{
    await axios.put(`/api/members/${id}`, {
      fullName:newName,
      idNumber:member.idNumber,
      phone:newPhone,
      plan:newPlan,
      registrationFee:member.registrationFee,
      membershipFee:newMembershipFee,
      registrationDate:member.registrationDate
    });
    loadDashboard();
  }catch(err){
    alert(err.response.data.error||'Error updating member');
  }
}

async function deleteMember(id){
  if(!confirm('Are you sure you want to delete this member?')) return;
  try{
    await axios.delete(`/api/members/${id}`);
    loadDashboard();
  }catch(err){
    alert(err.response.data.error||'Error deleting member');
  }
}

// ------------------- Search & Filter -------------------
const searchInput = document.getElementById('searchInput');
const planFilter = document.getElementById('planFilter');

searchInput.addEventListener('input',()=>filterMembers());
planFilter.addEventListener('change',()=>filterMembers());

function filterMembers(){
  const searchText = searchInput.value.toLowerCase();
  const selectedPlan = planFilter.value;
  const filtered = membersData.filter(m=>{
    return (m.fullName.toLowerCase().includes(searchText)
            || m.idNumber.toLowerCase().includes(searchText)
            || m.phone.toLowerCase().includes(searchText))
           && (selectedPlan==='' || m.plan===selectedPlan);
  });
  renderTable(filtered);
}

// ------------------- Charts -------------------
function renderCharts(){
  const planCounts = {};
  membersData.forEach(m=>planCounts[m.plan]=(planCounts[m.plan]||0)+1);

  const planCtx = document.getElementById('planChart').getContext('2d');
  new Chart(planCtx,{
    type:'pie',
    data:{
      labels:Object.keys(planCounts),
      datasets:[{
        data:Object.values(planCounts),
        backgroundColor:['#34d399','#60a5fa','#f87171'],
        hoverOffset:15
      }]
    },
    options:{animation:{animateScale:true}}
  });

  const payCtx = document.getElementById('paymentsChart').getContext('2d');
  new Chart(payCtx,{
    type:'bar',
    data:{
      labels:membersData.map(m=>m.fullName),
      datasets:[
        {label:'Reg Fee', data:membersData.map(m=>m.registrationFee), backgroundColor:'#fbbf24'},
        {label:'Membership Fee', data:membersData.map(m=>m.membershipFee), backgroundColor:'#3b82f6'}
      ]
    },
    options:{responsive:true, plugins:{legend:{position:'top'}}}
  });
}

// ------------------- Count-Up Animation -------------------
function animateCount(id,target){
  let start=0;
  const duration=800;
  const stepTime=20;
  const increment=target/(duration/stepTime);
  const obj=document.getElementById(id);
  const counter=setInterval(()=>{
    start+=increment;
    if(start>=target){obj.innerText=target; clearInterval(counter);}
    else obj.innerText=Math.floor(start);
  },stepTime);
}

// ------------------- Export -------------------
function exportCSV(){
  let csv='Name,ID,Phone,Plan,Reg Fee,Membership Fee,Reg Date\n';
  membersData.forEach(m=>{csv+=`${m.fullName},${m.idNumber},${m.phone},${m.plan},${m.registrationFee},${m.membershipFee},${m.registrationDate}\n`;});
  const blob = new Blob([csv],{type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download='gym_members.csv'; a.click(); URL.revokeObjectURL(url);
}

async function exportPDF(){
  const { jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  const doc = new jsPDF();
  doc.text("Gym Members",14,16);
  let y=26;
  membersData.forEach(m=>{
    doc.text(`${m.fullName} | ${m.idNumber} | ${m.phone} | ${m.plan} | ${m.registrationFee} | ${m.membershipFee} | ${m.registrationDate}`,14,y);
    y+=8;
  });
  doc.save("gym_members.pdf");
}

// ------------------- Auto Refresh -------------------
loadDashboard();
setInterval(loadDashboard,30000);
