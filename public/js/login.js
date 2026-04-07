document.getElementById('loginForm').onsubmit = function(e){
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  // Hardcoded admin credentials
  const admin = {username: 'admin', password: '1234'};

  if(username === admin.username && password === admin.password){
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid username or password!');
  }
}
