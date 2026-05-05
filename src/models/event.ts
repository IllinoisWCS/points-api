import { Schema, model } from 'mongoose';

const EventSchema = new Schema<Event>({
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
  start: {
    type: Date,
    required: function () {
      return !this.isSystem;
    }
  },
  end: {
    type: Date,
    required: function () {
      return !this.isSystem;
    }
  },
  private: { type: Boolean, default: false },
  isSystem: { type: Boolean, default: false }
});

export default model<Event>('Event', EventSchema);
