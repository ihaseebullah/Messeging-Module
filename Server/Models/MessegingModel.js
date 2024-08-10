const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true, // Index for quick lookups
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    userRoomId: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId if this references another collection
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', }]
});

const messagesSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: 'Sent',
            enum: ['Sent', 'Delivered', 'Seen'],
        },
    },
    { timestamps: true }
);

messagesSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
userSchema.index({ username: 1 });
userSchema.index({ isActive: 1 });

const Messages = mongoose.model('Message', messagesSchema);
const User = mongoose.model('User', userSchema)
module.exports = { Messages, User }
