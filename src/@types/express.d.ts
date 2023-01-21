import { Types } from 'mongoose';
import { Profile } from 'passport-saml';

declare global {
  namespace Express {
    interface User {
      _id: Types.MongoId;
      netId: string;
      role: string;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user: User & Record;
    samlLogoutRequest: Profile;
  }
}
