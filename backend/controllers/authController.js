const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = new User({
      name,
      email,
      password, // ✅ raw password - model handles hashing
      role,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

// LOGIN// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[LOGIN] Incoming:', email);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('[LOGIN] No user found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    console.log('[LOGIN] Password match:', isMatch);

    if (!isMatch) {
      console.log('[LOGIN] Incorrect password for:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('[LOGIN] Successful login for:', email);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    console.error('[LOGIN] Error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};
