const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthUser = require('../entity/AuthUser');
const validateCreateAuthUser = require('../validation/authUserValidation');

// ROUTES /v1/auth

// POST = REGISTER
router.post('/register', async (req, res) => {
  try {
    const { error } = validateCreateAuthUser(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Input validation failed',
        errors: error.details
      });
    }

    const userCount = await AuthUser.countDocuments();
    const hashedPassword = await bcrypt.hash(req.body.password, 15);
    
    const newAuthUser = new AuthUser({
      email: req.body.email,
      password: hashedPassword,
      role: userCount === 0 ? 'ADMIN' : 'USER',
    });
    
    await newAuthUser.save();
    res.status(201).json({ message: 'User registered successfully'});
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    console.error(err)
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST = LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password ) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await AuthUser.findOne({ email });
    if (!user) {
      return res.status(401).json('Wrong email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json('Wrong email or password');
    }

    await AuthUser.updateOne(
      { _id: user._id },
      {
        $set: {
          lastLogin: new Date(),
          ipAddress: req.ip,
        }
      },
    );

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.TOKEN_KEY,
      { expiresIn: '8h' },
    );

    res.status(200).json({
      id: user._id,
      email: user.email,
      role: user.role,
      accessToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).json('Internal server error');
  }
});

module.exports = router;