import { Types } from 'mongoose';

// The top-level import above makes this file a module, which `declare global`
// requires. Don't remove it. See badge.d.ts for a full example.

declare global {
  type MapStoryType = 'Alumni' | 'New Grad' | 'Internship';

  interface MapStory {
    _id: Types.ObjectId;
    notionPageId: string;
    name: string;
    story: string;
    type: MapStoryType;
    city: string;
    state: string;
    gradYear: number;
    company: string;
    jobTitle: string;
    lat?: number;
    long?: number;
    linkedinUrl?: string;
    headshotUrl?: string;
    approved?: boolean;
    displayPublicly?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
}
