"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user"));
exports.usersRoute = express_1.default.Router();
exports.usersRoute.get('/', async (_req, res, next) => {
    user_1.default.find({}, null, { sort: { points: -1 } })
        .populate({ path: 'events', options: { sort: { start: -1 } } })
        .exec(function (err, result) {
        if (err)
            return next(err);
        res.status(200).send(result);
    });
});
exports.usersRoute.get('/:netId', async (req, res, next) => {
    user_1.default.find({ netId: req.params.netId })
        .populate({ path: 'events', options: { sort: { start: -1 } } })
        .exec(function (err, result) {
        if (err)
            return next(err);
        if (result) {
            res.status(200).send(result);
        }
        else {
            res.sendStatus(404);
        }
    });
});
exports.usersRoute.delete('/:netId', async (req, res, next) => {
    user_1.default.findOneAndDelete({ netId: req.params.netId }).exec(function (err, result) {
        if (err)
            return next(err);
        if (result) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(404);
        }
    });
});
exports.usersRoute.patch('/:netId', async (req, res, next) => {
    user_1.default.findOneAndUpdate({ netId: req.params.netId }, { ...req.body }, function (err, result) {
        if (err)
            return next(err);
        if (result) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(404);
        }
    });
});
