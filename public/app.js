document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const taskForm = document.getElementById('task-form');
  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  const tasksList = document.getElementById('tasks-list');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  let currentFilter = 'all';
  
  // Load tasks on page load
  loadTasks();
  
  // Event listeners
  taskForm.addEventListener('submit', addTask);
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update filter and reload tasks
      currentFilter = button.dataset.status;
      loadTasks();
    });
  });
  
  // Functions
  async function loadTasks() {
    try {
      const response = await fetch(`/api/tasks?status=${currentFilter}`);
      const tasks = await response.json();
      
      renderTasks(tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }
  
  function renderTasks(tasks) {
    tasksList.innerHTML = '';
    
    if (tasks.length === 0) {
      tasksList.innerHTML = '<p>No tasks found.</p>';
      return;
    }
    
    tasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.className = `task-item ${task.status}`;
      
      taskElement.innerHTML = `
        <div class="task-header">
          <div class="task-title">${task.title}</div>
          <div class="task-status ${task.status}">${formatStatus(task.status)}</div>
        </div>
        <div class="task-description">${task.description || 'No description'}</div>
        <div class="task-actions">
          <button class="status-btn" data-id="${task.id}" data-status="not_done">Not Done</button>
          <button class="status-btn" data-id="${task.id}" data-status="in_progress">In Progress</button>
          <button class="status-btn" data-id="${task.id}" data-status="done">Done</button>
          <button class="delete-btn" data-id="${task.id}">Delete</button>
        </div>
      `;
      
      tasksList.appendChild(taskElement);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.status-btn').forEach(button => {
      button.addEventListener('click', updateTaskStatus);
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', deleteTask);
    });
  }
  
  async function addTask(e) {
    e.preventDefault();
    
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    
    if (!title) return;
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description })
      });
      
      if (response.ok) {
        titleInput.value = '';
        descriptionInput.value = '';
        loadTasks();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }
  
  async function updateTaskStatus(e) {
    const taskId = parseInt(e.target.dataset.id);
    const status = e.target.dataset.status;
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        loadTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }
  
  async function deleteTask(e) {
    const taskId = parseInt(e.target.dataset.id);
    
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        loadTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
  
  function formatStatus(status) {
    switch (status) {
      case 'not_done': return 'Not Done';
      case 'in_progress': return 'In Progress';
      case 'done': return 'Done';
      default: return status;
    }
  }
});