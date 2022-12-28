const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  netId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  created: {
    type: Date,
    default: Date.now,
  },
  isOfficer: { type: Boolean, default: false },
  events: [{ type: mongoose.ObjectId, ref: "Event" }],
  points: { type: Number, default: 0, min: 0 },
});

module.exports = mongoose.model("User", UserSchema);
