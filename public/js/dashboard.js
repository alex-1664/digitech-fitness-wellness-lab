if(localStorage.getItem('isLoggedIn') !== 'true'){
  window.location.href = 'login.html';
}

let members = JSON.parse(localStorage.getItem('members')) || [];

function updateDashboard(){
  document.getElementById('totalMembers').textContent = members.length;
  const totalReg = members.reduce((s,m)=>s+Number(m.regFee||0),0);
  const totalMembership = members.reduce((s,m)=>s+Number(m.membershipFee||0),0);
  document.getElementById('totalRegFees').textContent = `Ksh ${totalReg}`;
  document.getElementById('totalMembershipFees').textContent = `Ksh ${totalMembership}`;
}

function renderTable(){
  const tbody = document.getElementById('membersBody');
  tbody.innerHTML = '';
  members.forEach(m=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${m.name}</td><td>${m.id}</td><td>${m.phone}</td><td>${m.plan}</td>
      <td>${m.regFee}</td><td>${m.membershipFee}</td><td>${m.regDate}</td>
      <td>${m.emergencyName}</td><td>${m.emergencyPhone}</td><td>${m.weights?.slice(-1)[0]?.weight||''}</td>
    `;
    tbody.appendChild(tr);
  });
  updateDashboard();
  renderCharts();
}

function renderCharts(){
  const planCounts = {Daily:0,Weekly:0,Monthly:0};
  members.forEach(m=>planCounts[m.plan]!==undefined && planCounts[m.plan]++);
  const ctx = document.getElementById('planChart').getContext('2d');
  new Chart(ctx,{
    type:'pie',
    data:{labels:Object.keys(planCounts),datasets:[{data:Object.values(planCounts)}]}
  });
}

function logout(){
  localStorage.removeItem('isLoggedIn');
  window.location.href='login.html';
}

renderTable();
