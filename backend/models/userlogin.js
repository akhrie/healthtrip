
const mongoose = require('mongoose');

const tableStructure = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        required: true,
        enum: [0, 1]
    }
});

module.exports = mongoose.model("User", tableStructure);

