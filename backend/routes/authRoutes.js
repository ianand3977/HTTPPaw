// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const { protect } = require('../middleware/authMiddleware');
// const nodemailer = require('nodemailer');

// const router = express.Router();

// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS_KEY,
//     },
// });

// router.get('/send-test-email', async (req, res) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: 'anandgu2002@gmail.com', // Replace with your test recipient email
//     subject: 'Test Email',
//     text: 'This is a test email sent from Nodemailer.',
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error('Error sending email:', error);
//       return res.status(500).json({ error: 'Error sending test email' });
//     }
//     console.log('Email sent:', info.response);
//     res.status(200).json({ message: 'Test email sent successfully!' });
//   });
// });


// router.post('/signup', async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists. Try with another email ID.' });
//     }

//     const newUser = new User({ name, email, password, isVerified: false });
//     await newUser.save();

    // const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // const verificationLink = `http://localhost:5000/api/auth/verify/${token}`;

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Email Verification',
//       text: `Click the following link to verify your email: ${verificationLink}`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error sending email:', error);
//         return res.status(500).json({ error: 'Error sending verification email' });
//       }
//       console.log('Email sent:', info.response);
//       res.status(201).json({ message: 'User created! Please check your email to verify your account.' });
//     });
//   } catch (error) {
//     console.error('Signup error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// router.get('/verify/:token', async (req, res) => {
//   try {
//     const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId);

//     if (!user) {
//       return res.status(400).json({ error: 'Invalid token or user not found' });
//     }

//     user.isVerified = true;
//     await user.save();

//     res.redirect('/login');
//   } catch (error) {
//     console.error('Verification error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const isPasswordValid = await user.matchPassword(password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: 'Invalid password' });
//     }

//     const token = jwt.sign({ userId: user._id }, 'your_jwt_secret_key', { expiresIn: '1h' });
//     res.json({ token, user: { _id: user._id, email: user.email } });
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// router.get('/check', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-password');
//     res.json({ user });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Define a logout endpoint (if needed, otherwise handle logout on the client-side)
// router.post('/logout', (req, res) => {
//   // Since logout does not need to clear anything server-side, we just send a response
//   res.status(200).json({ message: 'Logout successful' });
// });

// module.exports = router;

const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const axios = require('axios');

require('dotenv').config();

const router = express.Router();
const { googleLogin } = require('../controllers/authController');



// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS_KEY,
  },
});


// Google Login Route
router.post('/google', googleLogin);

// User signup route
// router.post('/signup', async (req, res) => {
//   const { email, password, name } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists. Try with another email ID.' });
//     }

//     const newUser = new User({ email, password, name, isVerified: false });
//     await newUser.save();

//     // Generate verification token
//     const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     const verificationLink = `${process.env.BASE_URL}/api/auth/verify/${token}`;

//     // Send verification email
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Verify your email',
//       html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error sending verification email:', error);
//         return res.status(500).json({ error: 'Signup successful, but error sending verification email' });
//       }
//       console.log('Verification email sent:', info.response);
//     });

//     res.status(201).json({ message: 'User created! Verification email sent.' });
//   } catch (error) {
//     console.error('Error during signup:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists. Try with another email ID.' });
    }

    const newUser = new User({ email, password, name, isVerified: false });
    await newUser.save();

    // Debug logging for JWT_SECRET
    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    // Token generation
    let token;
    try {
      token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Token generated successfully');
    } catch (error) {
      console.error('Error generating token:', error);
      return res.status(500).json({ error: 'Error generating token' });
    }

    const verificationLink = `${process.env.BASE_URL}/api/auth/verify/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending verification email:', error);
        return res.status(500).json({ error: 'Signup successful, but error sending verification email' });
      }
      console.log('Verification email sent:', info.response);
    });

    res.status(201).json({ message: 'User created! Verification email sent.' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// User login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if password is provided
  if (!password) {
    console.log('Password not provided');
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    console.log('Login Attempt:', { email, password });

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isVerified) {
      console.log('Email not verified:', email);
      return res.status(403).json({ error: 'Email not verified' });
    }

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Login successful:', { token, user: { _id: user._id, email: user.email, name: user.name } });

    res.json({ token, user: { _id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Check user route (protected)
router.get('/check', protect, async (req, res) => {
  try {
    // Fetch the user by the ID stored in the request object by the protect middleware
    const user = await User.findById(req.user._id).select('-password');
    
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Send the user data as a response
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    // Handle unexpected errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify email route
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="3;url=${process.env.CLIENT_URL}/login" />
        </head>
        <body>
          <p>Email verified successfully. Redirecting to login page in 3 seconds...</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'Error verifying email' });
  }
});

// Test email sending endpoint
router.get('/send-test-email', async (req, res) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'barmalashish19@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email sent from Nodemailer.',
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ error: 'Error sending test email' });
  }
});

module.exports = router;

