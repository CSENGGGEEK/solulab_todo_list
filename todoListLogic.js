const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secretKey } = require('./config');
const { getConnection } = require('./db');
const authMiddleware = require('./authmiddleware');
const { ObjectId } = require('mongodb');

const router = express.Router();

// Login Route
router.post(
  '/api/auth/login',
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
      let existingUser = await conn.collection('demousers').findOne({ email });
      if (!existingUser) {
        // You may want to hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10); // Use bcrypt to hash the password

        // Create the new user
        const result = await conn.collection('demousers').insertOne({ email, password: hashedPassword });
        existingUser = { _id: result.insertedId, email }; // Set the existingUser object with the newly created user
      }

      // User exists, check password
      const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Generate JWT token for authentication
      const payload = { user: { id: existingUser._id } };
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
      return res.json({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// Logout Route
router.get('/api/auth/logout',authMiddleware, (req, res) => {
  // Clear the JWT token from the client side
  res.clearCookie('token');
  // Redirect the user to the login page or any other desired destination
  res.render('login');
});

// Dashboard Route
router.get('/api/dashboard', async (req, res) => {
  res.render('dashboard');
});

// Add Task Route
router.post('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const { taskTitle, startDate, endDate, description, priority, status } = req.body;
    const userId = req.user.id;

    const conn = await getConnection();

    // Insert the new task data into the database
    const result = await conn.collection('demotasks').insertOne({ userId, taskTitle, startDate, endDate, description, priority, status });
    const insertedTask = { _id: result.insertedId.toString(), taskTitle, startDate, endDate, description, priority, status };
  
    res.status(200).json({ message: 'Task added successfully', task: insertedTask });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Get All Tasks Route
router.get('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const conn = await getConnection();

    // Fetch all tasks related to the user from the database
    const tasks = await conn.collection('demotasks').find({ userId }).toArray();
  
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Edit Task Route
router.put('/api/tasks/:taskId', authMiddleware, async (req, res) => {
  try {
    const { taskTitle, startDate, endDate, description, priority, status } = req.body;
    const userId = req.user.id;
    const taskId = new ObjectId(req.params.taskId);

    const conn = await getConnection();

    // Update the task data in the database
    await conn.collection('demotasks').updateOne({ _id: taskId, userId }, {
      $set: { taskTitle, startDate, endDate, description, priority, status }
    });

    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Delete Task Route
router.delete('/api/tasks/:taskId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = new ObjectId(req.params.taskId);

    const conn = await getConnection();

    // Delete the task from the database
    await conn.collection('demotasks').deleteOne({ _id: taskId, userId });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Route to fetch user email
router.get('/api/user', async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.user.id;

    const conn = await getConnection();
    const user = await conn.collection('demousers').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ email: user.email });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Route to render login page
router.get('', async (req, res) => {
  res.render('login');
});

module.exports = router;
