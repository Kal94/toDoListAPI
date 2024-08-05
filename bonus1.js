// bonus1.js

const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'todoList';

MongoClient.connect(url, async (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of the day

    const projectsWithTasksDueToday = await db.collection('projects').aggregate([
        {
            $lookup: {
                from: 'tasks',
                localField: '_id',
                foreignField: 'projectId',
                as: 'tasks'
            }
        },
        {
            $unwind: '$tasks'
        },
        {
            $match: {
                'tasks.dueDate': today
            }
        },
        {
            $group: {
                _id: '$_id',
                name: { $first: '$name' },
                tasksDueToday: { $push: '$tasks' }
            }
        }
    ]).toArray();

    console.log('Projects with tasks due today:', projectsWithTasksDueToday);
    client.close();
});