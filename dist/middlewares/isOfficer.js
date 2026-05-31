"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401);
    }
    if (req.user.role !== 'officer') {
        return res.sendStatus(403);
    }
    next();
};
