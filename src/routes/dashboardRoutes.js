const express = require("express");
const router = express.Router();

// Mock member, attendance, and payments
let members = [
  { memberId: "DFL1023", name: "John Doe", expiry: "2026-12-31" },
  { memberId: "DFL1024", name: "Jane Smith", expiry: "2026-12-31" }
];

let attendance = [
  { memberId: "DFL1023", time: new Date("2026-03-09T08:00:00") },
  { memberId: "DFL1024", time: new Date("2026-03-09T09:00:00") },
  { memberId: "DFL1023", time: new Date("2026-03-10T08:30:00") }
];

let payments = [
  { month: "Jan", amount: 5000 },
  { month: "Feb", amount: 12000 },
  { month: "Mar", amount: 15000 },
  { month: "Apr", amount: 10000 },
  { month: "May", amount: 18000 },
  { month: "Jun", amount: 20000 }
];

// Utility: get last 7 days labels
function getLast7Days() {
  const days = [];
  const counts = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
    days.push(dayLabel);

    const count = attendance.filter(a => {
      const ad = new Date(a.time);
      return ad.toDateString() === d.toDateString();
    }).length;

    counts.push(count);
  }
  return days.map((day, i) => ({ day, count: counts[i] }));
}

// API Endpoint: /api/dashboard
router.get("/", (req, res) => {
  const totalMembers = members.length;
  const today = new Date().toDateString();
  const todayCheckins = attendance.filter(a => new Date(a.time).toDateString() === today).length;
  const revenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const expiringSoon = members.filter(m => {
    const expiry = new Date(m.expiry);
    const now = new Date();
    const diffDays = (expiry - now) / (1000*60*60*24);
    return diffDays <= 30;
  }).length;

  const dailyCheckins = getLast7Days();
  const monthlyRevenue = payments;

  res.json({
    members: totalMembers,
    checkins: todayCheckins,
    revenue,
    expiring: expiringSoon,
    dailyCheckins,
    monthlyRevenue
  });
});

module.exports = router;
