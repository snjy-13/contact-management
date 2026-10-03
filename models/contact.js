const crypto = require('crypto');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create schema for contact
const ContactSchema = new Schema(
    {
        contactId: {
            type: String,
            unique: true,
            default: () => crypto.randomUUID(),
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },
    },
    { timestamps: true }
);

// Create model for contact
const Contact = mongoose.model('contact', ContactSchema);

module.exports = Contact;
