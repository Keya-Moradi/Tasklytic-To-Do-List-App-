const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Create new task
router.post('/', (req, res) => {
    const { title, description, dueDate } = req.body;
    const newTask = new Task({
        title,
        description,
        dueDate,
        userId: req.user._id // Assuming the user is logged in and we are using Passport.js
    });

    newTask.save()
        .then(() => res.redirect('/tasks'))
        .catch(err => console.error(err));
});

// Get all tasks for the logged-in user
router.get('/', (req, res) => {
    Task.find({ userId: req.user._id }) // Filter tasks by the logged-in user
        .then(tasks => res.render('tasks/index', { tasks }))
        .catch(err => console.error(err));
});

// Edit task
router.get('/:id/edit', (req, res) => {
    Task.findById(req.params.id)
        .then(task => res.render('tasks/edit', { task }))
        .catch(err => console.error(err));
});

// Update task
router.put('/:id', (req, res) => {
    const { title, description, dueDate } = req.body;
    Task.findByIdAndUpdate(req.params.id, { title, description, dueDate })
        .then(() => res.redirect('/tasks'))
        .catch(err => console.error(err));
});

// Mark task as complete
router.put('/:id/complete', (req, res) => {
    Task.findByIdAndUpdate(req.params.id, { completed: true })
        .then(() => res.redirect('/tasks'))
        .catch(err => console.error(err));
});

// Show task details
router.get('/:id', (req, res) => {
    Task.findById(req.params.id)
        .then(task => res.render('tasks/show', { task }))
        .catch(err => console.error(err));
});

// Delete task
router.delete('/:id', (req, res) => {
    Task.findByIdAndDelete(req.params.id)
        .then(() => res.redirect('/tasks'))
        .catch(err => console.error(err));
});

module.exports = router;