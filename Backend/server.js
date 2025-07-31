const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;
const User = require('./models/User');



app.use(cors({
    origin: ["http://localhost:3000"],
    // credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Login attempt:", email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(400).json({ message: 'User not found' });
        }

        console.log("User found:", user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Incorrect password");
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Duplicate user:", existingUser);
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});