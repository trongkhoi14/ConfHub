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
        typre: String,
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
        type: String,
    },
    link: {
        type: String,
    },
    rating: {
        welcoming: String,
        feedback: String,
        networking: String,
        interaction: String,
        topPeople: String,
        worthwhile: String,
        avgRating: String,
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