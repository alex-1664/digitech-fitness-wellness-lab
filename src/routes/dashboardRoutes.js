// Fetch or store members data
let members = [];

// Example: populate dashboard stats
function updateDashboard() {
  document.getElementById('totalMembers').textContent = members.length;
  let totalReg = members.reduce((sum, m) => sum + Number(m.regFee || 0), 0);
  let totalMembership = members.reduce((sum, m) => sum + Number(m.membershipFee || 0), 0);
  document.getElementById('totalRegFees').textContent = `Ksh ${totalReg}`;
  document.getElementById('totalMembershipFees').textContent = `Ksh ${totalMembership}`;
}

// Render members table
function renderTable() {
  const tbody = document.getElementById('membersBody');
  tbody.innerHTML = '';
  members.forEach((m, idx) => {
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
}

// Search & filter
document.getElementById('searchInput').addEventListener('input', e => {
  const query = e.target.value.toLowerCase();
  const filtered = members.filter(m => 
    m.name.toLowerCase().includes(query) || 
    m.id.toLowerCase().includes(query) ||
    m.phone.toLowerCase().includes(query)
  );
  members = filtered;
  renderTable();
});

// CSV / PDF exports (basic placeholders)
function exportCSV() { alert('Export CSV feature coming!'); }
function exportPDF() { alert('Export PDF feature coming!'); }

// Example functions for edit/delete
function editMember(idx) { alert('Edit member: ' + members[idx].name); }
function deleteMember(idx) {
  if(confirm('Delete ' + members[idx].name + '?')) {
    members.splice(idx, 1);
    renderTable();
  }
}

// Dummy data for demo
members = [
  {name: 'Alex Kiio', id: '12345', phone: '0701055560', plan:'Monthly', regFee:400, membershipFee:1500, regDate:'2026-04-07'},
  {name: 'Mary Wanjiku', id: '12346', phone: '0712345678', plan:'Weekly', regFee:400, membershipFee:500, regDate:'2026-04-06'},
];
renderTable();
