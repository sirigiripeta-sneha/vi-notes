require('dotenv').config();

const jwt = require('jsonwebtoken');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log("Mongo Error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const bcrypt = require('bcryptjs');
    const User = require('./models/User');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const User = require('./models/User');
    const bcrypt = require('bcryptjs');

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      message: "Login successful",
      token: token
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error logging in" });
  }
});

const Text = require('./models/Text');

app.post('/save', async (req, res) => {
  try {
    const token = req.headers['authorization'];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const {
      content,
      startTime,
      endTime,
      duration,
      pasteCount,
      pastedTextLength,
      totalKeystrokes
    } = req.body;

    const newSession = new Text({
      userId: decoded.id,
      content,
      startTime,
      endTime,
      duration,
      pasteCount,
      pastedTextLength,
      totalKeystrokes
    });

    await newSession.save();

    res.json({ message: "Session saved with user ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving session" });
  }
});

app.get('/my-sessions', async (req, res) => {
  try {
    const token = req.headers['authorization'];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const sessions = await Text.find({ userId: decoded.id });

    res.json(sessions);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching sessions" });
  }
});
