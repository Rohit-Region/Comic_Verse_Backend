const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Get all users
exports.getUsers = (req, res) => {
  userModel.find({})
    .then(users => {
      console.log("Entered", users);
      res.status(200).json({ data: users });
    })
    .catch(err => {
      console.error("Error fetching users", err);
      res.status(500).json({ error: 'Failed to fetch users' });
    });
};

// Register a new user
exports.createUser = (req, res) => {
  const { name, email, phone_number, role, password, token } = req.body;
  console.log("Entered")
  const newUser = new userModel({
    name,
    email,
    phone_number,
    role,
    password,
    token,
  });

  newUser.save()
    .then(user => {
      res.status(200).json({ data: user });
    })
    .catch(err => {
      console.error("Error creating user", err);
      res.status(400).json({ error: 'An error occurred', details: err });
    });
};

// Login user
exports.login = (req, res) => {
  const { email, password } = req.body;

  userModel.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (password !== user.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const { role } = user;
      const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
      const isLoggedIn = true;

      return res.status(200).json({ isLoggedIn, role, message: 'Login successful', token });
    })
    .catch(err => {
      console.error('Error logging in', err);
      res.status(500).json({ message: 'Server error' });
    });
};
