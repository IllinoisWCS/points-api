"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vintageRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user"));
const isAuthenticated_1 = __importDefault(require("../middlewares/isAuthenticated"));
const isOfficer_1 = __importDefault(require("../middlewares/isOfficer"));
exports.vintageRoute = express_1.default.Router();
exports.vintageRoute.patch('/redeem', isAuthenticated_1.default, isOfficer_1.default, async (req, res, next) => {
    console.log('req.user:', req.user);
    const { targetNetId } = req.body;
    if (!targetNetId) {
        return res.status(400).send({ message: 'Missing targetNetId' });
    }
    try {
        const user = await user_1.default.findOneAndUpdate({ netId: targetNetId }, { $inc: { n_checkpoints: 1 } }, { new: true });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        return res
            .status(200)
            .send({ message: 'Checkpoint redeemed successfully', user });
    }
    catch (err) {
        return next(err);
    }
});
