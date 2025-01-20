const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: [String],
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    sendAt: {
        type: Date,
        required: true
    },
    gap: {
        type: Number,
        required: true
    }
});

const Email = mongoose.model('Email', EmailSchema);

module.exports = Email;
