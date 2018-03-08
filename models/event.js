var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
    name: String,
    points: Number,
    dateCreated: { type: Date, default: Date.now },
    date: { type: Date, default: Date.now },
    attendees: { type: Array, default: []}
});

module.exports = mongoose.model('Event', EventSchema);
