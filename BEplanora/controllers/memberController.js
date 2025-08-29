const Member = require("../models/Member");

// Member registration
exports.registerMember = async (req, res) => {
  const { name, email } = req.body;
  try {
    // check if email already exists
    const existing = await Member.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const member = new Member({ name, email, events: [] });
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Member login (via email + event code)
exports.loginMember = async (req, res) => {
  const { email, eventCode } = req.body;
  try {
    const member = await Member.findOne({ email, events: eventCode });
    if (!member) return res.status(400).json({ error: "Invalid email or event code" });
    res.json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
