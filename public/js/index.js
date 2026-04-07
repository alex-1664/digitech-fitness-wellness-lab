document.getElementById('memberForm').onsubmit = function(e){
  e.preventDefault();

  const members = JSON.parse(localStorage.getItem('members')) || [];

  const member = {
    name: document.getElementById('name').value.trim(),
    id: document.getElementById('id').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    emergencyName: document.getElementById('emergencyName').value.trim(),
    emergencyPhone: document.getElementById('emergencyPhone').value.trim(),
    weight: Number(document.getElementById('weight').value),
    plan: document.getElementById('plan').value,
    regFee: Number(document.getElementById('regFee').value),
    membershipFee: Number(document.getElementById('amount').value),
    regDate: new Date().toLocaleDateString(),
    weights: [{date:new Date().toLocaleDateString(), weight:Number(document.getElementById('weight').value)}]
  };

  if(members.some(m=>m.id===member.id)){
    alert('Member already exists!');
    return;
  }

  members.push(member);
  localStorage.setItem('members', JSON.stringify(members));
  alert('Member added!');
  this.reset();
}
