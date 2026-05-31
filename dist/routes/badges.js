"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.badgesRoute = void 0;
const express_1 = __importDefault(require("express"));
const badge_1 = __importDefault(require("../models/badge"));
exports.badgesRoute = express_1.default.Router();
exports.badgesRoute.get('/', async (req, res) => {
    try {
        const badges = await badge_1.default.find({});
        res.json(badges);
    }
    catch (error) {
        console.error('Error fetching badges:', error);
        res.status(500).json({ error: 'Failed to fetch badges' });
    }
});
