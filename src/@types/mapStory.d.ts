import { Types } from 'mongoose';

// The top-level import above makes this file a module, which `declare global`
// requires. Don't remove it. See badge.d.ts for a full example.

declare global {
  // TODO (Task 2): add `type MapStoryType = 'Alumni' | 'New Grad' | 'Internship';`

  interface MapStory {
    _id: Types.ObjectId;
    // TODO (Task 2): add the rest of the fields, matching src/models/mapStory.ts.
    // Required: notionPageId, name, story, type, city, state, gradYear, company, jobTitle
    // Optional (use `?`): lat, long, linkedinUrl, headshotUrl
    // With defaults (use `?`): approved, displayPublicly
    // From { timestamps: true } (use `?`): createdAt, updatedAt
  }
}
