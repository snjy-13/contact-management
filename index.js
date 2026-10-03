const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const contactRoutes = require('./routes/contacts');

const app = express();

const port = process.env.PORT || 5002;

app.use(express.json());

// Serve the frontend
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/contacts', contactRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    // Mongoose schema validation errors -> 400
    if (err.name === 'ValidationError') {
        const details = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ error: 'Validation failed', details });
    }
    // Invalid ObjectId cast errors -> 400
    if (err.name === 'CastError') {
        return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` });
    }
    // Duplicate unique field (email / contactId) -> 409
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        return res.status(409).json({ error: `A contact with this ${field} already exists` });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

// Connect to the database, then start the server
mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => {
        console.log('Database connected successfully');
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    });
