const mongoose = require('mongoose'); //import mongoose ,the library that connects Node.js to MongoDB

const connectDB = async () => {  //function that connect to MongoDB
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); //Read Url and connect backend to MongoDB Atlas asynchronously
    console.log(`MongoDB connected`); //print the host of the mongodb cluster if connected successfully 
  } catch (err) {
    console.error(err.message); // if the connection fail prints error
    process.exit(1);//stops the server
  }
};

module.exports = connectDB; // export and use it in app.js
