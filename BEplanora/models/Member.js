const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // unique email instead of email
  events: [String], // event codes
});

module.exports = mongoose.model("Member", MemberSchema);

