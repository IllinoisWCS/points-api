"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsRoute = void 0;
const express_1 = __importDefault(require("express"));
const nanoid_1 = require("nanoid");
const isOfficer_1 = __importDefault(require("../middlewares/isOfficer"));
const user_1 = __importDefault(require("../models/user"));
const event_1 = __importDefault(require("../models/event"));
exports.eventsRoute = express_1.default.Router();
const nanoid = (0, nanoid_1.customAlphabet)('123456789abcdefghijkmnopqrstuvwxyz', 6);
exports.eventsRoute.get('/', async (req, res, next) => {
    let query = {};
    const projection = ['-__v'];
    if (!req.user || req.user.role !== 'officer') {
        query = { private: false };
        projection.push('-key');
    }
    event_1.default.find(query, projection)
        .sort({ start: -1 })
        .exec(function (err, result) {
        if (err)
            return next(err);
        res.status(200).send(result);
    });
});
exports.eventsRoute.post('/', isOfficer_1.default, async (req, res, next) => {
    const eventKey = nanoid();
    const event = new event_1.default({
        ...req.body,
        key: eventKey
    });
    const err = event.validateSync();
    if (err)
        return next(err);
    event.save(function (err) {
        if (err)
            return next(err);
        res.status(200).send({
            message: 'Event created successfully',
            key: eventKey
        });
    });
});
exports.eventsRoute.delete('/:id', isOfficer_1.default, async (req, res, next) => {
    event_1.default.findOneAndDelete({ _id: req.params.id }, async function (err, result) {
        if (err)
            return next(err);
        if (result) {
            await user_1.default.updateMany({ events: result._id }, {
                $pull: {
                    events: result._id
                },
                $inc: { points: -result.points }
            });
            res.sendStatus(200);
        }
        else {
            res.sendStatus(404);
        }
    });
});
exports.eventsRoute.patch('/:id', isOfficer_1.default, async (req, res, next) => {
    event_1.default.findOneAndUpdate({ _id: req.params.id }, { ...req.body }, async function (err, result) {
        if (err)
            return next(err);
        if (result) {
            if (req.body.points) {
                await user_1.default.updateMany({ events: result._id }, {
                    $inc: { points: req.body.points - result.points }
                });
            }
            res.sendStatus(200);
        }
        else {
            res.sendStatus(404);
        }
    });
});
