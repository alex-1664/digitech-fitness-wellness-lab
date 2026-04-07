// CHARTS SETUP
function renderCharts() {
  // Members by Plan
  const planCounts = { Daily: 0, Weekly: 0, Monthly: 0 };
  members.forEach(m => {
    if (planCounts[m.plan] !== undefined) planCounts[m.plan]++;
  });

  const planCtx = document.getElementById('planChart').getContext('2d');
  new Chart(planCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(planCounts),
      datasets: [{
        data: Object.values(planCounts),
        backgroundColor: ['#3b82f6','#8b5cf6','#f59e0b']
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } }
    }
  });

  // Payments Overview
  const paymentCtx = document.getElementById('paymentsChart').getContext('2d');
  const totalReg = members.reduce((sum,m)=>sum+Number(m.regFee||0),0);
  const totalMembership = members.reduce((sum,m)=>sum+Number(m.membershipFee||0),0);

  new Chart(paymentCtx, {
    type: 'bar',
    data: {
      labels: ['Registration Fees','Membership Fees'],
      datasets: [{
        label: 'Ksh',
        data: [totalReg,totalMembership],
        backgroundColor: ['#10b981','#f59e0b']
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

// Update charts whenever table is rendered
renderTable();
renderCharts();
