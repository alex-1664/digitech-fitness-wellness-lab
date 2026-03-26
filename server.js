const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "gym",
  password: "password",
  port: 5432
});

const REG_FEE = 400;

// 👉 ADD / PAY MEMBER
app.post("/add", async (req, res) => {
  const { name, phone, membership, amount } = req.body;

  try {
    const check = await pool.query(
      "SELECT * FROM members WHERE phone=$1",
      [phone]
    );

    let member;
    let gymAmount = 0;

    // 🆕 NEW MEMBER
    if (check.rows.length === 0) {

      if (amount < REG_FEE) {
        return res.json({
          success: false,
          message: "Registration fee is Ksh 400 ❌"
        });
      }

      gymAmount = amount - REG_FEE;

      // expiry
      let expiry = new Date();
      if (membership === "Daily") expiry.setDate(expiry.getDate() + 1);
      if (membership === "Weekly") expiry.setDate(expiry.getDate() + 7);
      if (membership === "Monthly") expiry.setDate(expiry.getDate() + 30);

      const result = await pool.query(
        `INSERT INTO members(name, phone, membership, registration_paid, total_gym_paid, expiry_date)
         VALUES($1,$2,$3,true,$4,$5) RETURNING *`,
        [name, phone, membership, gymAmount, expiry]
      );

      member = result.rows[0];

      // 💰 Save registration
      await pool.query(
        `INSERT INTO payments(member_id, amount, type)
         VALUES($1,$2,'registration')`,
        [member.id, REG_FEE]
      );

      // 💰 Save gym
      if (gymAmount > 0) {
        await pool.query(
          `INSERT INTO payments(member_id, amount, type, membership_type)
           VALUES($1,$2,'membership',$3)`,
          [member.id, gymAmount, membership]
        );
      }

    } else {
      // 🔁 EXISTING MEMBER
      member = check.rows[0];

      let expiry = new Date(member.expiry_date || new Date());
      if (membership === "Daily") expiry.setDate(expiry.getDate() + 1);
      if (membership === "Weekly") expiry.setDate(expiry.getDate() + 7);
      if (membership === "Monthly") expiry.setDate(expiry.getDate() + 30);

      await pool.query(
        `UPDATE members 
         SET total_gym_paid = total_gym_paid + $1,
             membership = $2,
             expiry_date = $3
         WHERE id = $4`,
        [amount, membership, expiry, member.id]
      );

      await pool.query(
        `INSERT INTO payments(member_id, amount, type, membership_type)
         VALUES($1,$2,'membership',$3)`,
        [member.id, amount, membership]
      );
    }

    res.json({ success: true, member });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 👉 GET MEMBERS
app.get("/members", async (req, res) => {
  const result = await pool.query("SELECT * FROM members ORDER BY id DESC");
  res.json(result.rows);
});

// 👉 GET PAYMENTS
app.get("/payments", async (req, res) => {
  const result = await pool.query("SELECT * FROM payments");
  res.json(result.rows);
});

app.listen(5000, () => console.log("Server running on port 5000"));
