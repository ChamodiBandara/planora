// const mongoose = require("mongoose");

// const MemberSubSchema = new mongoose.Schema({
//   name: String,
//   email: String
// }, { _id: true }); // this ensures each member gets a unique _id automatically

// const TaskSubSchema = new mongoose.Schema({
//   title: String,
//   deadline: Date,
//   assignedTo: {
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//   },
//   status: { type: String, default: "pending" }
// }, { _id: true });

// const EventSchema = new mongoose.Schema({
//   name: String,
//   code: String,
//   location: String,
//   date: Date,
//   description: String,

//   members: [MemberSubSchema],
//   tasks: [TaskSubSchema]
  
// });

// module.exports = mongoose.model("Event", EventSchema);
const mongoose = require("mongoose");

const MemberSubSchema = new mongoose.Schema({
  name: String,
  email: String
}, { _id: true });

const TaskSubSchema = new mongoose.Schema({
  title: String,
  deadline: Date,
  assignedTo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  status: { type: String, default: "pending" }
}, { _id: true });

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true},
  location: { type: String, required: true },
  date: { type: Date, required: true },  // Just type, no new Date() here
  description: String,
  members: [MemberSubSchema],
  tasks: [TaskSubSchema]
});

module.exports = mongoose.model("Event", EventSchema);
