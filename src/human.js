const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// Function to connect to MongoDB
async function connectToDatabase() {
    const uri = 'mongodb+srv://babtandayana2:fgqitiace2UlTxxP@cluster0.w7qgva7.mongodb.net/'; // Update with your MongoDB connection string
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db('petApp'); // Replace 'petApp' with your database name
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
}

router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('humans');
        const result = await collection.find().toArray();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching humans from database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('humans');
        const { humanName, humanAge } = req.body;
        await collection.insertOne({ humanName, humanAge });
        res.status(200).json({ message: 'Human added successfully' });
    } catch (error) {
        console.error('Error adding human to database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to update a human in the database based on humanName
router.put('/:humanName', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const humanName = req.params.humanName; // Accessing humanName from URL parameter
        const updatedHuman = {
            humanName: req.body.humanName, // Accessing humanName from request body
            humanAge: parseInt(req.body.humanAge)
        };
        const result = await db.collection('humans').updateOne({ humanName }, { $set: updatedHuman });
        if (result.modifiedCount === 0) {
            res.status(404).json({ message: `Human with name ${humanName} not found` });
        } else {
            res.status(200).json({ message: `Human with name ${humanName} updated successfully` });
        }
    } catch (err) {
        console.error('Error updating human in database', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/:humanName', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('humans');
        const humanName = req.params.humanName;
        const result = await collection.deleteOne({ humanName });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: `Human ${humanName} not found` });
        } else {
            res.status(200).json({ message: `Deleted human ${humanName}` });
        }
    } catch (error) {
        console.error('Error deleting human from database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:humanName', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('humans');
        const Name = req.params.humanName;
        const result = await collection.findOne({ Name });
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: `Human ${Name} not found` });
        }
    } catch (error) {
        console.error('Error fetching human from database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
