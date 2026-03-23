const bcrypt = require("bcrypt");

let adminUser = null;

async function createDefaultAdmin() {
  if (!adminUser) {
    const hash = await bcrypt.hash("password123", 10);
    adminUser = {
      username: "admin",
      password: hash
    };
    console.log("✅ Default admin created: admin / password123");
  }
}

async function findAdmin(username) {
  if (adminUser && adminUser.username === username) {
    return adminUser;
  }
  return null;
}

async function verifyPassword(admin, password) {
  return await bcrypt.compare(password, admin.password);
}

module.exports = { createDefaultAdmin, findAdmin, verifyPassword };
