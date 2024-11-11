const mongoose = require('mongoose');

const todoListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a list name']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    description: String
}, {
    timestamps: true
});

module.exports = mongoose.model('TodoList', todoListSchema); 