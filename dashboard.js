document.addEventListener("DOMContentLoaded", () => {
  const membersBody = document.getElementById("membersBody");
  const weightModal = document.getElementById("weightModal");
  const weightForm = document.getElementById("weightForm");
  const closeWeightModal = document.getElementById("closeWeightModal");
  const modalName = document.getElementById("modalName");
  const modalId = document.getElementById("modalId");
  const modalPlan = document.getElementById("modalPlan");
  const modalStatus = document.getElementById("modalStatus");
  const memberModal = document.getElementById("memberModal");
  const closeMemberModal = document.getElementById("closeMemberModal");
  const beep = document.getElementById("beepSound");

  let members = JSON.parse(localStorage.getItem("members")) || [];
  let attendanceRecords = JSON.parse(localStorage.getItem("attendance")) || [];
  let weightHistory = JSON.parse(localStorage.getItem("weightHistory")) || [];

  function renderMembers() {
    membersBody.innerHTML = "";
    members.forEach(m => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${m.phone}</td>
        <td>${m.plan}</td>
        <td>${m.regFee}</td>
        <td>${m.membershipFee}</td>
        <td>${m.regDate}</td>
        <td>${m.emergencyName}</td>
        <td>${m.emergencyPhone}</td>
        <td>${m.weight || ""}</td>
        <td><button onclick="updateWeight('${m.id}')">Update Weight</button></td>
      `;
      membersBody.appendChild(tr);
    });
    updateSummary();
  }

  function updateSummary(){
    document.getElementById("totalMembers").textContent = members.length;
    const weights = members.map(m=>parseFloat(m.weight)).filter(w=>!isNaN(w));
    const avgWeight = weights.length? (weights.reduce((a,b)=>a+b,0)/weights.length).toFixed(1) : 0;
    document.getElementById("avgWeight").textContent = avgWeight;

    // Weekly attendance %
    const weekStart = new Date(); weekStart.setDate(weekStart.getDate()-6);
    const presentDays = attendanceRecords.filter(r=> new Date(r.date)>=weekStart).length;
    const possibleDays = members.length * 7;
    document.getElementById("weeklyAttendance").textContent = possibleDays? Math.round((presentDays/possibleDays)*100)+"%" : "0%";
  }

  window.updateWeight = function(id){
    weightModal.style.display = "flex";
    weightForm.dataset.memberId = id;
  }

  closeWeightModal.onclick = () => weightModal.style.display="none";

  weightForm.onsubmit = function(e){
    e.preventDefault();
    const id = this.dataset.memberId;
    const date = document.getElementById("weightDate").value;
    const newWeight = document.getElementById("newWeight").value;
    const member = members.find(m=>m.id===id);
    if(member){ 
      member.weight = newWeight; 
      weightHistory.push({memberId:id, date, weight:newWeight});
    }
    localStorage.setItem("members", JSON.stringify(members));
    localStorage.setItem("weightHistory", JSON.stringify(weightHistory));
    renderMembers();
    weightModal.style.display="none";
    renderWeightChart();
  }

  // Attendance Scanner
  Quagga.init({
    inputStream: { name: "Live", type: "LiveStream", target: document.querySelector('#scanner'), constraints: { facingMode: "environment", width: 500, height: 300 } },
    decoder: { readers: ["code_128_reader","ean_reader","code_39_reader"] }
  }, err=>{ if(err) console.error(err); else Quagga.start(); });

  Quagga.onDetected(result=>{
    const memberId = result.codeResult.code;
    const member = members.find(m=>m.id===memberId);
    if(!member){ alert(`Member ID ${memberId} not registered.`); return; }

    const today = new Date().toLocaleDateString();
    let todayRecord = attendanceRecords.find(r=>r.memberId===memberId && r.date===today);

    if(todayRecord){
      if(!todayRecord.timeOut) todayRecord.timeOut = new Date().toLocaleTimeString();
    } else {
      attendanceRecords.push({ memberId, date: today, timeIn: new Date().toLocaleTimeString(), timeOut:null });
    }
    localStorage.setItem("attendance", JSON.stringify(attendanceRecords));
    beep.play();

    modalName.textContent = member.name;
    modalId.textContent = member.id;
    modalPlan.textContent = member.plan;
    modalStatus.textContent = todayRecord ? "Already Checked In" : "Checked In";
    memberModal.style.display = "flex";
    renderMembers();
    renderAttendanceChart();
  });

  closeMemberModal.onclick = ()=>memberModal.style.display="none";

  function renderWeightChart(){
    const ctx = document.getElementById("weightChart").getContext("2d");
    const labels = [...new Set(weightHistory.map(w=>w.date))];
    const datasets = members.map(m=>({
      label:m.name,
      data: labels.map(date=>{ const w = weightHistory.find(w=>w.memberId===m.id && w.date===date); return w?w.weight:null; }),
      borderColor: "#"+Math.floor(Math.random()*16777215).toString(16),
      fill:false,
      tension:0.2
    }));
    if(window.weightChart) window.weightChart.destroy();
    window.weightChart = new Chart(ctx,{type:"line", data:{labels,datasets}});
  }

  function renderAttendanceChart(){
    const ctx = document.getElementById("attendanceChart").getContext("2d");
    const labels = [];
    const data = [];
    for(let i=6;i>=0;i--){
      const d = new Date(); d.setDate(d.getDate()-i);
      const dateStr = d.toLocaleDateString();
      labels.push(dateStr);
      data.push(attendanceRecords.filter(r=>r.date===dateStr).length);
    }
    if(window.attChart) window.attChart.destroy();
    window.attChart = new Chart(ctx,{type:"bar", data:{labels,datasets:[{label:"Members Present", data, backgroundColor:"green"}]}});
  }

  renderMembers();
  renderWeightChart();
  renderAttendanceChart();
});
