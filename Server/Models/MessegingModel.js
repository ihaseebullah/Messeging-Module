const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    createdDate: {
        type: Date,
        default: Date.now
    }, userRoomId: { type: String },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

const messeges = new mongoose.Schema({
    sender: String,
    receiver: String,
    text: String,
    status: { type: String, default: "Sent", enum: ["Sent", "Delieverd", "Seen"] }
}, { timestamps: true })


const Messeges = mongoose.model('Messege', messeges)
const User = mongoose.model('User', userSchema)
module.exports = { Messeges, User }
