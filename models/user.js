var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema(
  {
    netId: { type: String, required: true },
    points: { type: Number, default: 0 },
    attendedEvents: { type: Array, default: [] },
  },
  { usePushEach: true }
);

module.exports = mongoose.model("User", UserSchema);
