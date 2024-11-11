const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const { protect } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

// Get all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('list', 'name');
        res.json(todos);
    } catch (error) {
        console.error('Get todos error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create new todo
router.post('/', async (req, res) => {
    try {
        if (!req.body.text || !req.body.list) {
            return res.status(400).json({ message: 'Please provide text and list ID' });
        }

        const todo = await Todo.create({
            text: req.body.text,
            list: req.body.list,
            user: req.user._id,
            dueDate: req.body.dueDate
        });

        res.status(201).json(todo);
    } catch (error) {
        console.error('Create todo error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update todo
router.put('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Make sure user owns todo
        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedTodo);
    } catch (error) {
        console.error('Update todo error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete todo
router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Make sure user owns todo
        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await todo.remove();
        res.json({ message: 'Todo removed' });
    } catch (error) {
        console.error('Delete todo error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router; 