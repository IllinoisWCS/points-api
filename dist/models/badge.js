"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BadgeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    unearnedDescription: { type: String, required: true },
    tier: { type: Number },
    shape: { type: String, required: true },
    image: { type: String, required: true },
    isTiered: { type: Boolean, required: true },
    category: { type: String },
    count: { type: Number }
});
exports.default = (0, mongoose_1.model)('Badge', BadgeSchema);
