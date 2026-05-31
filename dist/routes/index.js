"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = __importDefault(require("../middlewares/isAuthenticated"));
const auth_1 = require("./auth");
const events_1 = require("./events");
const profile_1 = require("./profile");
const users_1 = require("./users");
const checkpoints_1 = require("./checkpoints");
const badges_1 = require("./badges");
const vintage_1 = require("./vintage");
exports.routes = express_1.default.Router();
exports.routes.use('/auth', auth_1.authRoute);
exports.routes.use('/events', events_1.eventsRoute);
exports.routes.use('/profile', isAuthenticated_1.default, profile_1.profileRoute);
exports.routes.use('/users', isAuthenticated_1.default, users_1.usersRoute);
exports.routes.use('/checkpoints', checkpoints_1.checkpointsRoute);
exports.routes.use('/badges', badges_1.badgesRoute);
exports.routes.use('/vintage', vintage_1.vintageRoute);
exports.routes.use((_req, res) => {
    res.sendStatus(404);
});
