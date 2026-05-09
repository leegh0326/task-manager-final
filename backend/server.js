const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, "tasks.json");

function readTasks() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(dataFile));
}

function writeTasks(tasks) {
  fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2));
}

app.get("/tasks", (req, res) => {
  res.json(readTasks());
});

app.post("/tasks", (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    completed: false,
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const id = Number(req.params.id);

  const updatedTasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: req.body.completed } : task
  );

  writeTasks(updatedTasks);
  res.json({ message: "Task updated" });
});

app.delete("/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const id = Number(req.params.id);

  const filteredTasks = tasks.filter((task) => task.id !== id);
  writeTasks(filteredTasks);

  res.json({ message: "Task deleted" });
});

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
