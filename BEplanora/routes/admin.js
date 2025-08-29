const express = require("express");
const router = express.Router();
const { signupAdmin, loginAdmin } = require("../controllers/adminController");

// ✅ Admin signup
router.post("/signup", signupAdmin);

// ✅ Admin login
router.post("/login", loginAdmin);

module.exports = router;
