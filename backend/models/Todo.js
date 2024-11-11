const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please add a text value']
    },
    completed: {
        type: Boolean,
        default: false
    },
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TodoList',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dueDate: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Todo', todoSchema); 