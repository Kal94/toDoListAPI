const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv')


const app = express();
app.use(bodyParser.json());
dotenv.config()

const url = 'mongodb://localhost:27017';
const dbName = 'todoList';
let db;

// Connect to MongoDB
MongoClient.connect(url, (err, client) => {
    if (err) throw err;
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
});

// Task Endpoints

// Create a new task
app.post('/tasks', async (req, res) => {
    try {
        const task = req.body;
        task.status = 'to-do';
        const result = await db.collection('tasks').insertOne(task);
        res.status(201).json(result.ops[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// List all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await db.collection('tasks').find().toArray();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit a task
app.put('/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const updates = req.body;
        const result = await db.collection('tasks').findOneAndUpdate(
            { _id: ObjectId(taskId) },
            { $set: updates },
            { returnOriginal: false }
        );
        if (!result.value) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(result.value);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const result = await db.collection('tasks').deleteOne({ _id: ObjectId(taskId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark a task as done/to-do
app.patch('/tasks/:id/status', async (req, res) => {
    try {
        const taskId = req.params.id;
        const { status } = req.body;
        const updates = { status };
        if (status === 'done') {
            updates.doneDate = new Date();
        } else if (status === 'to-do') {
            updates.startDate = new Date();
            updates.doneDate = null;
        }
        const result = await db.collection('tasks').findOneAndUpdate(
            { _id: ObjectId(taskId) },
            { $set: updates },
            { returnOriginal: false }
        );
        if (!result.value) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(result.value);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Filter tasks by status
app.get('/tasks/status/:status', async (req, res) => {
    try {
        const status = req.params.status;
        const tasks = await db.collection('tasks').find({ status }).toArray();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Search tasks by name
app.get('/tasks/search/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const tasks = await db.collection('tasks').find({ name: { $regex: name, $options: 'i' } }).toArray();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Sort tasks by dates
app.get('/tasks/sort/:dateField', async (req, res) => {
    try {
        const dateField = req.params.dateField;
        const tasks = await db.collection('tasks').find().sort({ [dateField]: 1 }).toArray();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Project Endpoints

// Create a new project
app.post('/projects', async (req, res) => {
    try {
        const project = req.body;
        const result = await db.collection('projects').insertOne(project);
        res.status(201).json(result.ops[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// List all projects
app.get('/projects', async (req, res) => {
    try {
        const projects = await db.collection('projects').find().toArray();
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit a project
app.put('/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id;
        const updates = req.body;
        const result = await db.collection('projects').findOneAndUpdate(
            { _id: ObjectId(projectId) },
            { $set: updates },
            { returnOriginal: false }
        );
        if (!result.value) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(result.value);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a project
app.delete('/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id;
        const result = await db.collection('projects').deleteOne({ _id: ObjectId(projectId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Assign a task to a project
app.patch('/tasks/:taskId/project/:projectId', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const projectId = req.params.projectId;
        const project = await db.collection('projects').findOne({ _id: ObjectId(projectId) });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        const result = await db.collection('tasks').findOneAndUpdate(
            { _id: ObjectId(taskId) },
            { $set: { projectId: ObjectId(projectId) } },
            { returnOriginal: false }
        );
        if (!result.value) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(result.value);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Filter tasks by project name
app.get('/tasks/project/:projectName', async (req, res) => {
    try {
        const projectName = req.params.projectName;
        const project = await db.collection('projects').findOne({ name: projectName });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        const tasks = await db.collection('tasks').find({ projectId: ObjectId(project._id) }).toArray();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Sort projects by dates
app.get('/projects/sort/:dateField', async (req, res) => {
    try {
        const dateField = req.params.dateField;
        const projects = await db.collection('projects').find().sort({ [dateField]: 1 }).toArray();
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});