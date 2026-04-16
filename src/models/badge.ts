import { Schema, model } from 'mongoose';

const BadgeSchema = new Schema<Badge>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  tier: { type: Number },
  shape: { type: String, required: true },
  image: { type: String, required: true },
  isTiered: { type: Boolean, required: true },
  category: { type: String },
  count: { type: Number }
});

export default model<Badge>('Badge', BadgeSchema);
