const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt=require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const verifyToken = require('./middleware');
// POST method

router.post('/register', async (req, res) => {
  try {
    const { name, email, password,role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    // Set JWT token in cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
  
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      message: "Email or Password not present",
    });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Login not successful",
        error: "User not found",
      });
    }

    // Check if password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Login not successful",
        error: "Invalid password",
      });
    }

    // Generate JWT token
    const maxAge = 3 * 60 * 60;
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: maxAge, // 3hrs in sec
      }
    );

    // Set JWT token as a cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000, // 3hrs in ms
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});
// GET all method
const maxAge = 10800; // 3 hours in seconds
router.get('/getAll', verifyToken, async (req, res) => {
  try {
    res.cookie("jwt", res.locals.token, {
      httpOnly: true,
      maxAge: maxAge * 1000, // 3hrs in ms
    });
    const data = await User.find();
    res.json(data);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET by ID method 
router.get('/getUser', verifyToken, async (req, res) => {
  try {
    res.cookie("jwt", res.locals.token, {
      httpOnly: true,
      maxAge: maxAge * 1000, // 3hrs in ms
    });

    const user = await User.findOne({ _id: req.query.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update by ID method
// router.patch('/update/:id', async (req, res) => {
//   const { role } = req.body;
//   const id = req.params.id;

//   if (!role || !id) {
//     return res.status(400).json({ message: "Role and ID are required" });
//   }

//   try {
//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.role === "admin") {
//       return res.status(400).json({ message: "User is already an admin" });
//     }

//     user.role = role;
//     await user.save();

//     res.status(201).json({ message: "Update successful", user });
//   } catch (error) {
//     res.status(500).json({ message: "An error occurred", error: error.message });
//   }
// });


// Delete by ID method
// router.delete('/deleteUser', verifyToken, async (req, res) => {
//   try {  
//     res.cookie("jwt", res.locals.token, {
//       httpOnly: true,
//       maxAge: maxAge * 1000, // 3hrs in ms
//     });
//     // Check if user making the request has admin role
//     if (req.user.role !== 'admin') {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const data = await User.findByIdAndDelete({ _id: req.query.id });
//     res.json(`Document with ${data.name} has been deleted.`);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

module.exports = router;
