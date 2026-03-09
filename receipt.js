// Fill receipt from localStorage
const data = JSON.parse(localStorage.getItem("receiptData")) || {};
document.getElementById("receipt").innerText = data.receipt || "N/A";
document.getElementById("name").innerText = data.name || "N/A";
document.getElementById("phone").innerText = data.phone || "N/A";
document.getElementById("plan").innerText = data.plan || "N/A";
document.getElementById("amount").innerText = "KSh " + (data.amount || "0");
document.getElementById("date").innerText = new Date().toLocaleDateString();
document.getElementById("mpesa").innerText = data.mpesa || "Pending";

// Download A6 PDF
function downloadReceipt(){
    const element = document.getElementById("receipt-container");
    const options = {
        margin: 0.5,
        filename: 'digitech-receipt.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a6', orientation: 'portrait' }
    };
    html2pdf().from(element).set(options).save();
}
