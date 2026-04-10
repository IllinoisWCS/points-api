import { Types } from 'mongoose';

declare global {
  type UserRole = 'member' | 'committee' | 'officer';

  interface User {
    _id: Types.ObjectId;
    netId: string;
    name: string;
    created?: Date;
    role?: UserRole;
    events?: Array<Types.ObjectId>;
    points?: number;
    n_checkpoints?: number;
    timestamps?: Date[];
    n_total_events?: number;
    n_corporate_events?: number;
    n_explorations_events?: number;
    n_mentoring_events?: number;
    n_social_events?: number;
    badges?: string[];
  }
}
