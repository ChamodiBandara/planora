const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
 email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("Admin", adminSchema);
