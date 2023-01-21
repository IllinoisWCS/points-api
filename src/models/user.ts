import { Schema, model } from 'mongoose';

const UserSchema = new Schema<User>({
  netId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  created: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    default: 'member',
    enum: ['member', 'committee', 'officer']
  },
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  points: { type: Number, default: 0, min: 0 }
});

export default model<User>('User', UserSchema);
