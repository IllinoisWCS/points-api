var mongoose = require("mongoose");

var EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    points: { type: Number, required: true },
    category: { type: String, required: true },
    key: { type: String, required: true },
    startDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endDate: { type: String, required: true },
    endTime: { type: String, required: true },
    attendees: { type: Array, default: [] },
    private: { type: Boolean, default: false },
  },
  { usePushEach: true }
);

module.exports = mongoose.model("Event", EventSchema);
