ToDo List API

Overview

This project is a simple API for managing tasks and projects, designed to help you organize your work efficiently. It provides endpoints to create, update, delete, and retrieve tasks and projects, along with features to filter, sort, and search through your tasks and projects.

The API is built using Node.js, Express, and MongoDB (without using Mongoose). It’s a lightweight and easy-to-use solution for basic task management needs.

Features

	•	Task Management:
	•	Create, edit, delete tasks.
	•	Mark tasks as “to-do” or “done”.
	•	Filter tasks by status.
	•	Search tasks by name.
	•	Sort tasks by start date, due date, or done date.
	•	Project Management:
	•	Create, edit, delete projects.
	•	Assign tasks to projects.
	•	Filter tasks by project name.
	•	Sort projects by start date or due date.
	•	Bonus Aggregations:
	•	Find projects with tasks due today.
	•	Find tasks with projects due today.

Getting Started

Prerequisites

	•	Node.js: Ensure that Node.js is installed on your machine.
	•	MongoDB: Install MongoDB locally and make sure it is running.

Installation

	1.	Clone the repository:

        git clone https://github.com/yourusername/todo-list-api.git
        cd todo-list-api

    2.	Install the dependencies:

        npm install
    
    3.	Start MongoDB locally on the default port (27017).
	4.	Start the application:

        node index.js
    
    The server will start running on http://localhost:3000.

API Endpoints

Task Endpoints

	•	Create a new task:
        •	POST /tasks
        •	Request body example:

            {
                "name": "Task 1",
                "description": "Description of task 1",
                "startDate": "2024-08-05",
                "dueDate": "2024-08-10"
            }

    •	List all tasks:
	    •	GET /tasks

	•	Edit a task:
	    • PUT /tasks/:id
	    • Request body should include the fields to update.

	•	Delete a task:
	    • DELETE /tasks/:id

	•	Mark a task as done or to-do:
	    • PATCH /tasks/:id/status
	    • Request body example:

            {
                "status": "done"
            }

    •	Filter tasks by status:
	    • GET /tasks/status/:status

	•	Search tasks by name:
	    • GET /tasks/search/:name

	•	Sort tasks by dates:
	    • GET /tasks/sort/:dateField
	    • :dateField can be startDate, dueDate, or doneDate.

Project Endpoints

	•	Create a new project:
	•	POST /projects
	•	Request body example:

        {
            "name": "Project 1",
            "description": "Description of project 1",
            "startDate": "2024-08-01",
            "dueDate": "2024-09-01"
        }

    •	List all projects:
	    • GET /projects

	•	Edit a project:
	    • PUT /projects/:id
	    • Request body should include the fields to update.

	•	Delete a project:
	    • DELETE /projects/:id

	•	Assign a task to a project:
	    • PATCH /tasks/:taskId/project/:projectId

	•	Filter tasks by project name:
	    • GET /tasks/project/:projectName

	•	Sort projects by dates:
	    • GET /projects/sort/:dateField
	    • :dateField can be startDate or dueDate.

Bonus Aggregations

	•	Projects with tasks due today:
	•	Script: bonus1.js
	•	Run with: node bonus1.js
	•	Tasks with projects due today:
	•	Script: bonus2.js
	•	Run with: node bonus2.js