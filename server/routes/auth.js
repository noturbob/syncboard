const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
  try {
    // 1. Get user data from the request body
    const { name, email, password } = req.body;

    // 2. Check if the user already exists in the database
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 3. Create a new user instance
    user = new User({
      name,
      email,
      password, // Remember, the password will be hashed by our pre-save hook
    });

    // 4. Save the new user to the database
    await user.save();

    // 5. Send a success response
    res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;