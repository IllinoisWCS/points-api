import { Schema, model } from 'mongoose';

// TODO (Task 2): fill in the fields. Use src/models/badge.ts as a reference.
//
// Required: notionPageId (also unique: true), name, story, type, city, state,
//   gradYear (Number), company, jobTitle
// Optional: lat (Number), long (Number), linkedinUrl, headshotUrl
// Defaults: approved: { type: Boolean, default: false },
//   displayPublicly: { type: Boolean, default: false }
//
// `type` is a special key in Mongoose. Write the field as
//   type: { type: String, enum: ['Alumni', 'New Grad', 'Internship'], required: true }
// and don't nest it inside another object: in `location: { type: String, city: String }`,
// Mongoose treats `location` as a plain String and silently drops `city`.
//
// Don't add createdAt/updatedAt; { timestamps: true } below manages them.
const MapStorySchema = new Schema<MapStory>({}, { timestamps: true });

export default model<MapStory>('MapStory', MapStorySchema);
