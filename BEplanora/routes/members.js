const express = require("express");
const router = express.Router();
const { registerMember, loginMember } = require("../controllers/memberController");

// Member registration
router.post("/memberRegister", registerMember); // ← Member registration route

// Member login (username + event code)
router.post("/login", loginMember); // ← Member login route

module.exports = router;
