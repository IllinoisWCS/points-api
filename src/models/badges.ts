import { Schema, model } from 'mongoose';

interface Badge {
  id: string;
  titleText: string;
  descriptionText: string;
  image: string;
  section:
    | 'corporate'
    | 'explorations'
    | 'mentoring'
    | 'social'
    | 'misc'
    | 'future';
  tier?: 1 | 2 | 3;
}

const BadgeSchema = new Schema<Badge>({
  id: { type: String, required: true, unique: true },
  titleText: { type: String, required: true },
  descriptionText: { type: String, required: true },
  image: { type: String, required: true },
  section: {
    type: String,
    enum: [
      'corporate',
      'explorations',
      'mentoring',
      'social',
      'misc',
      'future'
    ],
    required: true
  },
  tier: { type: Number, enum: [1, 2, 3] }
});

export default model<Badge>('Badge', BadgeSchema);
