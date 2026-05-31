"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user"));
const event_1 = __importDefault(require("../models/event"));
const badgeHelpers_1 = require("../utils/badgeHelpers");
const jwtVerify_1 = require("../middlewares/jwtVerify");
exports.profileRoute = express_1.default.Router();
exports.profileRoute.get('/', async (req, res, next) => {
    const user = await user_1.default.findById(req.user._id).lean();
    if (!user)
        return res.sendStatus(404);
    const events = await Promise.all(user.events.map((id) => event_1.default.findById(id).lean()));
    const filteredEvents = events.filter((e) => e !== null);
    return res.status(200).send({ ...user, events: filteredEvents });
});
exports.profileRoute.patch('/', async (req, res, next) => {
    const event = await event_1.default.findOne({ key: req.body.eventKey });
    if (!event) {
        return res.status(400).send({ message: 'Invalid event key' });
    }
    if (!event.isSystem &&
        new Date().getTime() - new Date(event.end).getTime() >
            parseInt(process.env.CHECK_IN_GRACE_PERIOD)) {
        return res.status(400).send({ message: 'Event not active' });
    }
    const categoryCounterMap = {
        corporate: 'n_corporate_events',
        explorations: 'n_explorations_events',
        mentoring: 'n_mentoring_events',
        social: 'n_social_events'
    };
    const countersToIncrement = { n_total_events: 1 };
    const categoryCounter = categoryCounterMap[event.category];
    if (categoryCounter) {
        countersToIncrement[categoryCounter] = 1;
    }
    user_1.default.findOneAndUpdate({ _id: req.user._id, events: { $ne: event._id } }, {
        $push: { events: event._id },
        $inc: { points: event.points, ...countersToIncrement }
    }, { new: true }, async function (err, result) {
        if (err)
            return next(err);
        if (result) {
            const newBadges = await (0, badgeHelpers_1.checkAndAwardBadges)(result, event.category);
            if (newBadges.length > 0) {
                await user_1.default.findOneAndUpdate({ _id: req.user._id }, { $push: { badges: { $each: newBadges } } });
            }
            res.status(200).send({
                message: 'Checked in successfully',
                event: event,
                newBadges: newBadges
            });
        }
        else {
            res.status(400).send({ message: 'Already checked in', event: event });
        }
    });
});
exports.profileRoute.patch('/submitForumAnswer', jwtVerify_1.verifyToken, async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).send({ message: 'Not authenticated' });
        }
        const forumAnswerEvent = await event_1.default.findOne({ key: 'forum-answer' });
        if (!forumAnswerEvent) {
            return res
                .status(500)
                .send({ message: 'Forum answer event not configured' });
        }
        const result = await user_1.default.findByIdAndUpdate(req.user._id, {
            $push: { events: forumAnswerEvent._id },
            $inc: { points: 0.5, n_total_events: 1 }
        }, { new: true });
        if (!result) {
            return res.status(404).send({ message: 'User not found' });
        }
        return res.status(200).send({
            message: '0.5 points added successfully',
            points: result.points
        });
    }
    catch (err) {
        return next(err);
    }
});
