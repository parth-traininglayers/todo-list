const express = require('express');
const router = express.Router();
const TodoList = require('../models/TodoList');
const Todo = require('../models/Todo');
const { protect } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(protect);

// Get all todo lists for user
router.get('/', async (req, res) => {
    try {
        const lists = await TodoList.find({ user: req.user._id });
        res.json(lists);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Create new todo list
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        const list = await TodoList.create({
            name,
            description,
            user: req.user._id
        });
        res.status(201).json(list);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update todo list
router.put('/:id', async (req, res) => {
    try {
        const list = await TodoList.findById(req.params.id);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }
        if (list.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        
        const updatedList = await TodoList.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedList);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete todo list
router.delete('/:id', async (req, res) => {
    try {
        const list = await TodoList.findById(req.params.id);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }
        if (list.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        
        // Delete all todos in the list
        await Todo.deleteMany({ list: req.params.id });
        await list.remove();
        res.json({ message: 'List removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 