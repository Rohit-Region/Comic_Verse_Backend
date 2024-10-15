const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const Counter = require('../models/counterModel'); 
async function getNextSequenceValue(sequenceName) {
  const counter = await Counter.findByIdAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true } // If the counter doesn't exist, create it
  );
  return counter.sequence_value;
}

// Get all users
exports.getUsers = (req, res) => {
  userModel.find({})
    .then(users => {
      console.log("Entered : ", users);
      res.status(200).json({ data: users });
    })
    .catch(err => {
      console.error("Error fetching users", err);
      res.status(500).json({ error: 'Failed to fetch users' });
    });
};

// Register a new user
exports.createUser =async (req, res) => {
  const { name, email, phoneNumber, role, password, token } = req.body;
  const userId = await getNextSequenceValue('userId');
  console.log("Entered",name)
  const newUser = new userModel({
    userId,
    name,
    email,
    phoneNumber,
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

      const { userId,name,email,role,phoneNumber } = user;
      const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
      const isLoggedIn = true;
      
      return res.status(200).json({ isLoggedIn,userId,name,email,role, phoneNumber, message: 'Login successful', token });
    })
    .catch(err => {
      console.error('Error logging in', err);
      res.status(500).json({ message: 'Server error' });
    });
};

// Update user profile
// Update user profile using PATCH
exports.updateProfile = async (req, res) => {
  const { userId } = req.params; // Assuming you're sending userId in the URL
  console.log("uSer ID :",userId)  
  const updates = req.body; // Get all fields from the request body
console.log("updates",updates)
  try {
    // Find the user by ID and update the fields provided in the request body
    const updatedUser = await userModel.findOneAndUpdate( // Use findOneAndUpdate
      { userId: userId }, // Query by userId
      updates, // Update fields
      { new: true, runValidators: true } // Options: return the updated document, apply validators
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ data: updatedUser });
  } catch (err) {
    console.error('Error updating user profile', err);
    res.status(400).json({ error: 'An error occurred', details: err });
  }
};


