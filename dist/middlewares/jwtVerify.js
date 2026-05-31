"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyToken(req, res, next) {
    const token = req.body.token;
    if (!token) {
        return res.status(401).send({ message: 'Missing token' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.jwt = decoded;
        next();
    }
    catch (err) {
        return res.status(401).send({ message: 'Invalid token' });
    }
}
exports.verifyToken = verifyToken;
