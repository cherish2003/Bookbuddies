const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    console.log("Registering user:", req.body);

    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("Logging in user:", req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
