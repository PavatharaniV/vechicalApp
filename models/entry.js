const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    details: {
        type: String
    },
    exitAt: {
        type: Date,
        default: null
    },
    duration: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Entry', entrySchema);
