const express = require('express');
const mongoose = require('mongoose');
const Contact = require('../models/contact');

const router = express.Router();

// MongoDB ObjectIds are 24 hexadecimal characters
const isValidObjectId = (id) =>
    mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);

const notFound = (res) => res.status(404).json({ error: 'Contact not found' });

// POST /contacts - create a new contact
router.post('/', async (req, res, next) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json(contact);
    } catch (err) {
        next(err);
    }
});

// GET /contacts - get all contacts
router.get('/', async (req, res, next) => {
    try {
        const contacts = await Contact.find().sort({ name: 1 });
        res.json(contacts);
    } catch (err) {
        next(err);
    }
});

// GET /contacts/:id - get a single contact by id
router.get('/:id', async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid contact ID format' });
        }
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return notFound(res);
        }
        res.json(contact);
    } catch (err) {
        next(err);
    }
});

// PUT /contacts/:id - update a contact by id
router.put('/:id', async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid contact ID format' });
        }
        // Only allow updating these fields (contactId stays immutable)
        const updates = (({ name, phone, email }) => ({ name, phone, email }))(req.body);
        const contact = await Contact.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });
        if (!contact) {
            return notFound(res);
        }
        res.json(contact);
    } catch (err) {
        next(err);
    }
});

// DELETE /contacts/:id - delete a contact by id
router.delete('/:id', async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid contact ID format' });
        }
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return notFound(res);
        }
        res.json({ message: 'Contact deleted successfully', contact });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
