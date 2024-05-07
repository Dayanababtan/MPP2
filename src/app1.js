const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import the MongoDB Node.js Driver
const { MongoClient } = require('mongodb');

// Connection URI for MongoDB Atlas
const uri = 'mongodb+srv://babtandayana2:fgqitiace2UlTxxP@cluster0.w7qgva7.mongodb.net/';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB Atlas
async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas', err);
    } 
}

connectToDatabase();

// Import your routers
const dogRoutes = require('./dog');
const humanRoutes = require('./human');

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// Use your routers
app.use('/dog', dogRoutes);
app.use('/human', humanRoutes);

// Error handling middleware
app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;
