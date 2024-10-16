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

      const { userId,name,email,role,phoneNumber,authorId } = user;
      const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
      const isLoggedIn = true;
      
      return res.status(200).json({ isLoggedIn,userId,name,email,role,authorId, phoneNumber, message: 'Login successful', token });
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
  console.log("User ID:", userId);
  
  const updates = req.body; // Get all fields from the request body
  console.log("Updates:", updates);

  try {
    // Find the user by userId
    const user = await userModel.findOne({ userId: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the fields provided in the request body
    Object.assign(user, updates);

    // Check if the role is set to 'author'
    if (user.role === 'author') {
      user.authorId = parseInt(`999${user.userId}`, 10); // Set authorId based on userId
    } else {
      user.authorId = undefined; // Clear authorId if not an author
    }

    // Save the updated user document
    const updatedUser = await user.save();

    res.status(200).json({ data: updatedUser });
  } catch (err) {
    console.error('Error updating user profile', err);
    res.status(400).json({ error: 'An error occurred', details: err });
  }
};



