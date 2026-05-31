"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const event_1 = __importDefault(require("../models/event"));
const dotenv_1 = __importDefault(require("dotenv"));
// run with: npx ts-node --files src/scripts/seedForumAnswerEvent.ts
dotenv_1.default.config();
async function seed() {
    await mongoose_1.default.connect(process.env.MONGODB_URI);
    await event_1.default.deleteOne({ key: 'forum-answer' });
    await event_1.default.create({
        key: 'forum-answer',
        name: 'Anonymous Q&A Forum Answer',
        category: 'other',
        points: 0.5,
        private: true,
        isSystem: true
    });
    console.log('Forum answer event seeded!');
    await mongoose_1.default.disconnect();
}
seed();
