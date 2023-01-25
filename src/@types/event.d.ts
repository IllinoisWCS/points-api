import { Types } from 'mongoose';

declare global {
  type EventCategory =
    | 'corporate'
    | 'social'
    | 'outreach'
    | 'mentoring'
    | 'explorations'
    | 'generalMeeting'
    | 'other';

  interface Event {
    _id: Types.ObjectId;
    key: string;
    name: string;
    category: EventCategory;
    points: number;
    start: Date;
    end: Date;
    private?: boolean;
  }
}
