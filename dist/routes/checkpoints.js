"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkpointsRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user"));
const isAuthenticated_1 = __importDefault(require("../middlewares/isAuthenticated"));
exports.checkpointsRoute = express_1.default.Router();
exports.checkpointsRoute.post('/redeem', async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await user_1.default.findByIdAndUpdate(userId, {
            $inc: { n_checkpoints: 1 },
            $push: { timestamps: new Date() }
        }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            success: true,
            n_checkpoints: user.n_checkpoints,
            timestamps: user.timestamps
        });
    }
    catch (error) {
        console.error('Error redeeming checkpoint:', error);
        res.status(500).json({ error: 'Failed to redeem checkpoint' });
    }
});
exports.checkpointsRoute.get('/:userId', isAuthenticated_1.default, async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await user_1.default.findById(userId).select('n_checkpoints timestamps');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            n_checkpoints: user.n_checkpoints,
            timestamps: user.timestamps
        });
    }
    catch (error) {
        console.error('Error fetching checkpoints:', error);
        res.status(500).json({ error: 'Failed to fetch checkpoints' });
    }
});
