import { Schema, model } from 'mongoose';

const MapStorySchema = new Schema<MapStory>(
  {
    notionPageId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    story: { type: String, required: true },
    type: {
      type: String,
      enum: ['Alumni', 'New Grad', 'Internship'],
      required: true
    },
    city: { type: String, required: true },
    state: { type: String, required: true },
    gradYear: { type: Number, required: true },
    company: { type: String, required: true },
    jobTitle: { type: String, required: true },
    lat: { type: Number },
    long: { type: Number },
    linkedinUrl: { type: String },
    headshotUrl: { type: String },
    approved: { type: Boolean, default: false },
    displayPublicly: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default model<MapStory>('MapStory', MapStorySchema);
