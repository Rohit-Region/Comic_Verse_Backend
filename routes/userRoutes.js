const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get all users
router.get('/get', userController.getUsers);

// Register a new user
router.post('/users', userController.createUser);

// Login route
router.post('/login', userController.login);

// Put Route
router.patch('/users/:userId', userController.updateProfile);

module.exports = router;
