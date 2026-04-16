import { Types } from 'mongoose';

declare global {
  type Tier = 1 | 2 | 3;
  type BadgeCategory =
    | 'n_corporate_events'
    | 'n_explorations_events'
    | 'n_mentoring_events'
    | 'n_social_events';
  type BadgeShape = 'circle' | 'diamond' | 'hexagon' | 'shield';

  interface Badge {
    _id: Types.ObjectId;
    name: string;
    description: string;
    tier?: Tier;
    shape: BadgeShape;
    image: string;
    isTiered: boolean;
    category?: BadgeCategory;
    count?: number;
  }
}
