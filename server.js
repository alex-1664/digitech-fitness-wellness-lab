const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static("public"));

let members = [];

// ================= ADD MEMBER =================
app.post("/add-member", (req, res) => {
  const member = req.body;

  if (members.some(m => m.id === member.id)) {
    return res.status(400).json({ message: "Member already exists" });
  }

  member.weights = [
    { date: new Date().toISOString().split("T")[0], weight: member.weight || 0 }
  ];

  members.push(member);
  res.json({ message: "Member added successfully" });
});

// ================= GET MEMBERS =================
app.get("/members", (req, res) => {
  res.json(members);
});

// ================= UPDATE MEMBER =================
app.put("/update-member/:id", (req, res) => {
  const id = req.params.id;
  const index = members.findIndex(m => m.id === id);

  if (index === -1) return res.status(404).send("Not found");

  members[index] = { ...members[index], ...req.body };
  res.json({ message: "Updated" });
});

// ================= DELETE MEMBER =================
app.delete("/delete-member/:id", (req, res) => {
  members = members.filter(m => m.id !== req.params.id);
  res.json({ message: "Deleted" });
});

// ================= UPDATE WEIGHT =================
app.post("/update-weight/:id", (req, res) => {
  const id = req.params.id;
  const member = members.find(m => m.id === id);

  if (!member) return res.status(404).send("Not found");

  if (!member.weights) member.weights = [];

  member.weights.push(req.body);

  res.json({ message: "Weight updated" });
});

// ================= START SERVER =================
app.listen(3000, () => console.log("Server running on port 3000"));
