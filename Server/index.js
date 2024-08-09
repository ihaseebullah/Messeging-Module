const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { User, Messeges } = require('./Models/MessegingModel');
const jwt = require('jsonwebtoken')
const WebSocket = require("ws");
const cookies = require('cookie-parser')
// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:ESkp0sknEgP1YpaK@cluster0.bp2y7j1.mongodb.net/messeging", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const app = express();

app.use(cors({
    origin: ['http://localhost:8081','http://localhost:8082'],
    credentials: true,
    // allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With'],
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookies({}))
// API Routes
app.post('/api/post', async (req, res) => {
    const { username } = req.body;
    try {
        const user = new User({ username });
        await user.save();
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

app.put('/api/update/roomId/:roomId/:userId', async (req, res) => {
    const { roomId, userId } = req.params;
    try {
        await User.findByIdAndUpdate(userId, { userRoomId: roomId });
        res.status(200).json({ message: 'Room ID updated' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating room ID' });
    }
});

app.get('/', async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

app.put('/api/friends/new/:friendId/:userId', async (req, res) => {
    const { friendId } = req.params;
    try {
        const friendAcc = await User.findById(friendId)
        if (friendAcc) {
            await User.findByIdAndUpdate(req.params.userId, { $push: { friends: friendId } }).then(() => {
                User.findByIdAndUpdate(req.params.userId, { $push: { friends: req.params.userId } })
            })
            res.status(200).json({ message: 'Friend added' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error adding friend' });
    }
})

app.get('/friends/:userId', async (req, res) => {
    const friends = await User.findById(req.params.userId).populate('friends')
    res.json(friends.friends)
})

app.post('/login', async (req, res) => {
    const { username } = req.body;
    console.log(username)
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        } else {
            jwt.sign({ user }, "MYSECRETE", {}, (err, token) => {
                if (err) throw err;
                res
                    .cookie("jwt", token, {})
                    .json({
                        user: user
                    })
                    .status(200);
            })
        }

    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
})



module.exports = { app }

require('./Socket/webSocket')