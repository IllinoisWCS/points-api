"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    netId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    created: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: 'member',
        enum: ['member', 'committee', 'officer']
    },
    events: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Event' }],
    points: { type: Number, default: 0, min: 0 },
    n_checkpoints: { type: Number, default: 0, min: 0 },
    timestamps: { type: [Date], default: [] },
    n_total_events: { type: Number, default: 0, min: 0 },
    n_corporate_events: { type: Number, default: 0, min: 0 },
    n_explorations_events: { type: Number, default: 0, min: 0 },
    n_mentoring_events: { type: Number, default: 0, min: 0 },
    n_social_events: { type: Number, default: 0, min: 0 },
    badges: [{ type: String, default: [] }]
});
exports.default = (0, mongoose_1.model)('User', UserSchema);
