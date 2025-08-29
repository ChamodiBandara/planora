require('dotenv').config();  // Load env variables (PORT and MONGO_URI)
const express = require('express'); // Import Express framework
const cors = require('cors'); // Import CORS middleware
const connectDB = require('./Config/db.js'); // Import DB connection

// Import route files
const eventsRoute = require('./routes/events');
const membersRoute = require('./routes/members');
const adminRoute = require('./routes/admin');

const app = express(); // Create an Express app

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use("/api/events", eventsRoute);
app.use("/api/members", membersRoute);
app.use("/api/admin", adminRoute);

// Simple route to check server is running
app.get('/', (req, res) => res.send('University Event Management API is running'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
