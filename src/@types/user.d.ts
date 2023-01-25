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
  }
}
