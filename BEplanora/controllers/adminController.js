const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// @desc    Signup a new admin
// @route   POST /api/admin/signup
// @access  Public
const signupAdmin = async (req, res) => {
  try {
    const { FirstName,LastName, email, password } = req.body;

    // check if admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new admin
  const admin = await Admin.create({
  firstName: FirstName,  // map frontend FirstName -> schema firstName
  lastName: LastName,    // map frontend LastName -> schema lastName
  email,
  password: hashedPassword,
});

    if (admin) {
   res.status(201).json({
  _id: admin.id,
  firstName: admin.firstName,
  lastName: admin.lastName,
  email: admin.email,
});
    } else {
      res.status(400).json({ message: "Invalid admin data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      _id: admin.id,
      firstname: admin.firstname,
      lastname: admin.lastname,
      email: admin.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signupAdmin, loginAdmin };
