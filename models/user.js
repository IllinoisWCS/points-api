var mongoose = require("mongoose");

/*
  Schema for User db objects
  netid: Illinois netid
  points: event points for user (will be updated to also include office hour + committee points)
  office_hours: array of all office hour dates attended
  committees: array of all committee meeting dates attended
*/

var UserSchema = new mongoose.Schema(
  {
    netid: String,
    points: Number,
    office_hours: { type: Array, default: [] },
    committees: { type: Array, default: [] }
  },
  { usePushEach: true }
);

module.exports = mongoose.model("User", UserSchema);
