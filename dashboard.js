// 🔐 LOGIN CHECK (TOP)
if(localStorage.getItem("isLoggedIn") !== "true"){
  window.location.href = "login.html";
}

// YOUR EXISTING CODE BELOW (DO NOT DELETE)
// members, renderTable, addMember, editMember, weight, charts...

// 🔐 LOGOUT (BOTTOM)
function logout(){
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}
