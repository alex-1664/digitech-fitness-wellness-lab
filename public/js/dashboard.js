document.getElementById("addForm").onsubmit = (e)=>{
  e.preventDefault();

  const file = document.getElementById("photo").files[0];
  const reader = new FileReader();

  reader.onload = function(){
    const member = {
      name: name.value,
      id: id.value,
      phone: phone.value,
      emergencyName: emergencyName.value,
      emergencyPhone: emergencyPhone.value,
      plan: plan.value,
      regFee: regFee.value,
      membershipFee: membershipFee.value,
      photo: reader.result,
      weights:[{
        date:new Date().toLocaleDateString(),
        weight:Number(weight.value)
      }]
    };

    if(members.some(m=>m.id===member.id)){
      alert("Duplicate ID!");
      return;
    }

    members.push(member);
    localStorage.setItem("members", JSON.stringify(members));

    closeAddModal();
    render();
  };

  if(file){
    reader.readAsDataURL(file);
  } else {
    reader.onload();
  }
};
