# Task Tracker

Task Tracker is a simple web application for managing tasks. It allows users to add, update, delete, and filter tasks based on their status.

## Features

- Add tasks with a title and optional description.
- Update task status (`Not Done`, `In Progress`, `Done`).
- Delete tasks.
- Filter tasks by status (`All`, `Not Done`, `In Progress`, `Done`).


## Installation

1. Clone the repository:
   ```bash
    git clone <repository-url>
   cd task-tracker
   
Add a task: add <title> [description]
Update a task: update <id> <title> [description]
Delete a task: delete <id>
Mark a task: mark <id> <status> (done, not_done, in_progress)

List tasks: list [all|done|not_done|in_progress]
API Endpoints
GET /api/tasks: Retrieve tasks (filter by status query param).
POST /api/tasks: Add a new task.
PUT /api/tasks/:id: Update a task by ID.
DELETE /api/tasks/:id: Delete a task by ID.
