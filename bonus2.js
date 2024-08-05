// bonus2.js

const { MongoClient, ObjectId } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'todoList';

MongoClient.connect(url, async (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of the day

    const tasksInProjectsDueToday = await db.collection('tasks').aggregate([
        {
            $lookup: {
                from: 'projects',
                localField: 'projectId',
                foreignField: '_id',
                as: 'project'
            }
        },
        {
            $unwind: '$project'
        },
        {
            $match: {
                'project.dueDate': today
            }
        },
        {
            $group: {
                _id: '$project._id',
                projectName: { $first: '$project.name' },
                tasks: { $push: '$$ROOT' }
            }
        }
    ]).toArray();

    console.log('Tasks in projects due today:', tasksInProjectsDueToday);
    client.close();
});