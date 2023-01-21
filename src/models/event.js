const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  key: { type: String, immutable: true, required: true, unique: true },
  name: { type: String, required: true },
  category: {
    type: String,
    enum: [
      'corporate',
      'social',
      'outreach',
      'mentoring',
      'explorations',
      'generalMeeting',
      'other'
    ],
    required: true
  },
  points: { type: Number, minimum: 0, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  private: { type: Boolean, default: false }
});

module.exports = mongoose.model('Event', EventSchema);
