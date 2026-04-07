document.addEventListener("DOMContentLoaded", () => {

  const attendanceTableBody = document.querySelector("#attendanceTable tbody");

  // Load existing attendance from LocalStorage
  let attendanceRecords = JSON.parse(localStorage.getItem("attendance")) || [];

  // Load registered members from dashboard (if available)
  let members = JSON.parse(localStorage.getItem("members")) || [];

  // Render table from stored records
  function renderTable() {
    attendanceTableBody.innerHTML = "";
    attendanceRecords.forEach(record => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${record.memberId}</td>
        <td>${record.date}</td>
        <td>${record.time}</td>
      `;
      attendanceTableBody.prepend(row);
    });
  }

  renderTable();

  // Initialize Quagga scanner
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#scanner'),
      constraints: { width: 500, height: 300, facingMode: "environment" }
    },
    decoder: { readers: ["code_128_reader", "ean_reader", "code_39_reader"] }
  }, function(err) {
    if (err) {
      console.error(err);
      alert("Camera initialization failed. Make sure your browser supports camera access.");
      return;
    }
    Quagga.start();
  });

  // On detection
  Quagga.onDetected(function(result) {
    const memberId = result.codeResult.code;

    // Optional: validate member exists
    if (!members.some(m => m.id === memberId)) {
      alert(`Member ID ${memberId} not found in registered members!`);
      return;
    }

    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    // Check if this member has already scanned today
    const alreadyScanned = attendanceRecords.some(r => r.memberId === memberId && r.date === date);
    if (alreadyScanned) {
      console.log(`${memberId} already scanned today.`);
      return;
    }

    // Add new record
    attendanceRecords.push({ memberId, date, time });
    localStorage.setItem("attendance", JSON.stringify(attendanceRecords));

    // Add to table
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${memberId}</td>
      <td>${date}</td>
      <td>${time}</td>
    `;
    attendanceTableBody.prepend(row);

    console.log(`Member scanned: ${memberId} at ${date} ${time}`);
  });

  // CSV Export
  document.getElementById("exportCSV").onclick = function() {
    if (attendanceRecords.length === 0) return alert("No attendance records to export.");

    let csv = "Member ID,Date,Time\n";
    attendanceRecords.forEach(r => csv += `${r.memberId},${r.date},${r.time}\n`);

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${new Date().toLocaleDateString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

});
