const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static('public'));

// MongoDB Atlas connection string
const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
}

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Test database connection
async function connectDB() {
    try {
        await client.connect();
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

connectDB();

// API endpoint to fetch YouTube links
app.get('/api/youtube-links', async (req, res) => {
    try {
        const database = client.db("discord_bot");
        const collection = database.collection("youtube_links");
        
        const links = await collection.find({}).toArray();
        res.json(links);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch links' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});