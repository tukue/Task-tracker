#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(process.cwd(), 'tasks.json');

// Load tasks from JSON file
function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(TASKS_FILE, 'utf8');
  return JSON.parse(data);
}

// Save tasks to JSON file
function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}

// Add a new task
function addTask(title, description = '') {
  const tasks = loadTasks();
  const task = {
    id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    title,
    description,
    status: 'not_done',
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  saveTasks(tasks);
  console.log(`Task added: ${title}`);
}

// Update an existing task
function updateTask(taskId, title, description) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    console.log(`Task ${taskId} not found`);
    return;
  }
  
  if (title) task.title = title;
  if (description !== undefined) task.description = description;
  
  saveTasks(tasks);
  console.log(`Task ${taskId} updated`);
}

// Delete a task
function deleteTask(taskId) {
  let tasks = loadTasks();
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== taskId);
  
  if (tasks.length === initialLength) {
    console.log(`Task ${taskId} not found`);
    return;
  }
  
  saveTasks(tasks);
  console.log(`Task ${taskId} deleted`);
}

// Mark a task with a status
function markTask(taskId, status) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    console.log(`Task ${taskId} not found`);
    return;
  }
  
  task.status = status;
  saveTasks(tasks);
  console.log(`Task ${taskId} marked as ${status}`);
}

// List tasks, optionally filtered by status
function listTasks(status) {
  const tasks = loadTasks();
  const filteredTasks = status === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === status);
  
  if (filteredTasks.length === 0) {
    console.log('No tasks found');
    return;
  }
  
  filteredTasks.forEach(task => {
    console.log(`[${task.id}] ${task.title} - ${task.status}`);
    if (task.description) {
      console.log(`    ${task.description}`);
    }
  });
}

// Print usage instructions
function printUsage() {
  console.log('Usage:');
  console.log('  node task-tracker.js add <title> [description]');
  console.log('  node task-tracker.js update <id> <title> [description]');
  console.log('  node task-tracker.js delete <id>');
  console.log('  node task-tracker.js mark <id> <status>');
  console.log('  node task-tracker.js list [all|done|not_done|in_progress]');
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    printUsage();
    return;
  }
  
  const command = args[0];
  
  try {
    switch (command) {
      case 'add':
        if (args.length < 2) {
          console.log('Error: Title is required');
          printUsage();
          break;
        }
        addTask(args[1], args[2] || '');
        break;
        
      case 'update':
        if (args.length < 3) {
          console.log('Error: ID and title are required');
          printUsage();
          break;
        }
        updateTask(parseInt(args[1]), args[2], args[3]);
        break;
        
      case 'delete':
        if (args.length < 2) {
          console.log('Error: ID is required');
          printUsage();
          break;
        }
        deleteTask(parseInt(args[1]));
        break;
        
      case 'mark':
        if (args.length < 3) {
          console.log('Error: ID and status are required');
          printUsage();
          break;
        }
        
        const status = args[2];
        if (!['done', 'not_done', 'in_progress'].includes(status)) {
          console.log("Invalid status. Use 'done', 'not_done', or 'in_progress'");
          break;
        }
        
        markTask(parseInt(args[1]), status);
        break;
        
      case 'list':
        const filter = args[1] || 'all';
        if (!['all', 'done', 'not_done', 'in_progress'].includes(filter)) {
          console.log("Invalid filter. Use 'all', 'done', 'not_done', or 'in_progress'");
          break;
        }
        listTasks(filter);
        break;
        
      default:
        printUsage();
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();