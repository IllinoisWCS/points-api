var mongoose = require("mongoose");

/*
  Schema for Event db objects
  name: event name
  points: number of points per event (GM/Code Ada/ChicTech - 2, all other events - 1)
  dateCreated: date event object was put into
  date: actual event date
  attendees: array of netids of everyone who signed in
*/

var EventSchema = new mongoose.Schema(
  {
    name: String,
    points: Number,
    category: String,
    key: String,
    date: { type: Date, default: Date.now },
    startTime: Number,
    endTime: Number,
    attendees: { type: Array, default: [] }
  },
  { usePushEach: true }
);

module.exports = mongoose.model("Event", EventSchema);
