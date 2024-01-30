const mongoose = require('mongoose')

var conferenceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    acronym: {
        type: String,
        required: true,
    },
    fieldOfResearch: {
        type: String,
    },
    source: {
        type: String,
    },
    category: {
        type: String
    },
    rank: {
        type: String,
    },
    date: {
        type: Date,
    },
    location: {
        type: String,
    },
    type: {
        type: String,
    },
    impactFactor: {
        type: Number,
    },
    link: {
        type: String,
    },
    rating: {
        welcoming: Number,
        feedback: Number,
        networking: Number,
        interaction: Number,
        topPeople: Number,
        worthwhile: Number,
        avgRating: Number,
    },
    callForPapers: [{
        content: String,
        note: String,
    }],
    document: [{
        documentName: String,
        submissionDate: Date,
        notificationDate: Date,
        cameraReady: Date,
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Conference', conferenceSchema);