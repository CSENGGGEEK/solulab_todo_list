const express = require('express');
const router = express.Router();
const {getConnection} = require('./db');

// Create a new user
router.post(
    '/auth',
    [
      check('email', 'Please enter a valid email').isEmail(),
      check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        const { email, password } = req.body;
  
        const conn = await getConnection();
  
        // Check if the user already exists
        let existingUser = await conn.collection('users').findOne({ email });
        if (existingUser) {
          // User already exists, redirect to dashboard
          // You may want to authenticate the user here before generating the token
          const payload = { user: { id: existingUser.id } };
          const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
          return res.json({ token });
        }
  
        // Create a new user
        const newUser = new User({
          email,
          password,
        });
  
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
  
        // Save the new user to the database
        await conn.collection('users').insertOne(newUser);
  
        // Generate JWT token for authentication
        const payload = { user: { id: newUser.id } };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
  
        // Redirect to dashboard
        res.json({ token });
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
      }
    }
  );
  