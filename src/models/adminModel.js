const pool = require("./db");
const bcrypt = require("bcrypt");

// Create table + default admin
async function createDefaultAdmin() {
  try {
    // 1. Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Check if admin exists
    const res = await pool.query(
      "SELECT * FROM admins WHERE username=$1",
      ["admin"]
    );

    // 3. Insert default admin if not exists
    if (res.rows.length === 0) {
      const hash = await bcrypt.hash("password123", 10);

      await pool.query(
        "INSERT INTO admins(username,password) VALUES($1,$2)",
        ["admin", hash]
      );

      console.log("✅ Default admin created in DB: admin / password123");
    }

  } catch (err) {
    console.error("❌ DB ERROR:", err.message);
  }
}

// Find admin
async function findAdmin(username) {
  const res = await pool.query(
    "SELECT * FROM admins WHERE username=$1",
    [username]
  );
  return res.rows[0];
}

// Verify password
async function verifyPassword(admin, password) {
  return await bcrypt.compare(password, admin.password);
}

module.exports = {
  createDefaultAdmin,
  findAdmin,
  verifyPassword
};
