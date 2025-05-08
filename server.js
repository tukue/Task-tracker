const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper functions
function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(TASKS_FILE, 'utf8');
  return JSON.parse(data);
}

function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}

// API Routes
// Get all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = loadTasks();
  const status = req.query.status;
  
  if (status && status !== 'all') {
    return res.json(tasks.filter(task => task.status === status));
  }
  
  res.json(tasks);
});

// Add a new task
app.post('/api/tasks', (req, res) => {
  const tasks = loadTasks();
  const { title, description = '' } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const task = {
    id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    title,
    description,
    status: 'not_done',
    createdAt: new Date().toISOString()
  };
  
  tasks.push(task);
  saveTasks(tasks);
  res.status(201).json(task);
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const tasks = loadTasks();
  const taskId = parseInt(req.params.id);
  const { title, description, status } = req.body;
  
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }
  
  if (title) task.title = title;
  if (description !== undefined) task.description = description;
  if (status) task.status = status;
  
  saveTasks(tasks);
  res.json(task);
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  let tasks = loadTasks();
  const taskId = parseInt(req.params.id);
  
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== taskId);
  
  if (tasks.length === initialLength) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }
  
  saveTasks(tasks);
  res.json({ message: `Task ${taskId} deleted` });
});

// Serve the main HTML file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});