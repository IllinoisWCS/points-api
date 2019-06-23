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
    name: { type: String, required: true },
    points: { type: Number, required: true },
    category: { type: String, required: true },
    key: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true},
    endTime: { type: String, required: true },
    attendees: { type: Array, default: [] },
  },
  { usePushEach: true }
);

module.exports = mongoose.model("Event", EventSchema);
