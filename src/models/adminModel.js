const pool = require("./db");
const bcrypt = require("bcrypt");

async function createDefaultAdmin(){
  const res = await pool.query("SELECT * FROM admins WHERE username=$1", ["admin"]);
  if(res.rows.length === 0){
    const hash = await bcrypt.hash("password123", 10);
    await pool.query("INSERT INTO admins(username,password) VALUES($1,$2)", ["admin", hash]);
    console.log("✅ Default admin created: admin / password123");
  }
}

async function findAdmin(username){
  const res = await pool.query("SELECT * FROM admins WHERE username=$1",[username]);
  return res.rows[0];
}

async function verifyPassword(admin, password){
  return await bcrypt.compare(password, admin.password);
}

module.exports = { createDefaultAdmin, findAdmin, verifyPassword };
