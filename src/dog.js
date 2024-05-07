const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const faker = require('faker');

// Connection URI for MongoDB Atlas
const uri = 'mongodb+srv://babtandayana2:fgqitiace2UlTxxP@cluster0.w7qgva7.mongodb.net/';

// Function to connect to MongoDB Atlas
async function connectToDatabase() {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        return client.db('petApp'); // Return the database instance
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas', err);
        throw err; // Throw error for handling elsewhere
    }
}

// Function to generate fake dog data
function generateDogs(num) {
    let dogs = [];
    for (let i = 1; i <= num; i++) {
        dogs.push({
            Name: faker.animal.dog(),
            Age: faker.random.number({ min: 1, max: 15 })
        });
    }
    return dogs;
}

// Route to get all dogs from the database
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const dogs = await db.collection('dogs').find({}).toArray();
        res.status(200).json(dogs);
    } catch (err) {
        console.error('Error fetching dogs from database', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to add a dog to the database
// Route to add a dog to the database
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const dog = {
            dogName: req.body.dogName,
            dogAge: parseInt(req.body.dogAge),
            humanName: req.body.humanName // Add ownerName to the dog object
        };
        console.debug('---------------------------------------------------------------')
        console.debug(dog)
        await db.collection('dogs').insertOne(dog);
        res.status(200).json({ message: 'Dog added successfully' });
    } catch (err) {
        console.error('Error adding dog to database', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Route to update a dog in the database based on dogName
router.put('/:dogName', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const dogName = req.params.dogName;
        const updatedDog = {
            dogName: req.body.dogName,
            dogAge: parseInt(req.body.dogAge)
        };
        const result = await db.collection('dogs').updateOne({ dogName }, { $set: updatedDog });
        if (result.modifiedCount === 0) {
            res.status(404).json({ message: `Dog with name ${dogName} not found` });
        } else {
            res.status(200).json({ message: `Dog with name ${dogName} updated successfully` });
        }
    } catch (err) {
        console.error('Error updating dog in database', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Route to delete a dog from the database based on dogName
router.delete('/:dogName', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const dogName = req.params.dogName;
        const result = await db.collection('dogs').deleteOne({ dogName });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: `Dog with name ${dogName} not found` });
        } else {
            res.status(200).json({ message: `Dog with name ${dogName} deleted successfully` });
        }
    } catch (err) {
        console.error('Error deleting dog from database', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add other routes (update, delete, etc.) similarly...

module.exports = router;
