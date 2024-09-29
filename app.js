const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const comicRoutes = require('./routes/comicRoutes');
const path = require('path');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // This line is important for form-data

// Routes
app.use('/api', userRoutes); // User-related routes

// Other middleware
app.use('/api/comics', comicRoutes);
// Start the server

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
