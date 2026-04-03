const mongoose = require('mongoose');

const textSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: String,
    startTime: Date,
    endTime: Date,
    duration: Number,
    pasteCount: Number,
pastedTextLength: Number,
totalKeystrokes: Number,
avgKeystrokeTime: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model('Text', textSchema);
