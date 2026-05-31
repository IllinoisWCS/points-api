"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const passport_saml_1 = require("passport-saml");
const user_1 = __importDefault(require("../models/user"));
const DISPLAY_NAME_ATTRIBUTE = 'urn:oid:2.16.840.1.113730.3.1.241';
const UID_ATTRIBUTE = 'urn:oid:0.9.2342.19200300.100.1.1';
exports.authRoute = express_1.default.Router();
const idpCertificate = fs_1.default.readFileSync('shibboleth/itrust.pem', 'utf8');
const samlPrivateKey = fs_1.default.readFileSync('shibboleth/sp-key.pem', 'utf8');
function getJWT(user) {
    return jsonwebtoken_1.default.sign({ netId: user.netId, _id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
}
passport_1.default.use(new passport_saml_1.Strategy({
    callbackUrl: process.env.CALLBACK_URL,
    entryPoint: 'https://shibboleth.illinois.edu/idp/profile/SAML2/Redirect/SSO',
    issuer: 'https://points-api.illinoiswcs.org/shibboleth',
    cert: idpCertificate,
    privateKey: samlPrivateKey,
    decryptionPvk: samlPrivateKey,
    identifierFormat: null,
    acceptedClockSkewMs: 300000
}, function (profile, done) {
    if (profile != null) {
        const displayName = profile.attributes[DISPLAY_NAME_ATTRIBUTE];
        const netId = profile.attributes[UID_ATTRIBUTE];
        user_1.default.findOneAndUpdate({ netId: netId }, { $set: { name: displayName } }, { upsert: true, new: true }, function (err, result) {
            if (err)
                return done(err);
            return done(null, {
                _id: result._id,
                netId: result.netId,
                role: result.role
            });
        });
    }
}));
passport_1.default.serializeUser(function (user, done) {
    process.nextTick(function () {
        done(null, { _id: user._id, netId: user.netId, role: user.role });
    });
});
passport_1.default.deserializeUser(function (user, done) {
    process.nextTick(function () {
        return done(null, user);
    });
});
exports.authRoute.get('/login', (req, res, next) => {
    const fromQR = req.query.fromQR;
    const fromQA = req.query.fromQA;
    const returnTo = req.query.returnTo;
    if (fromQA) {
        req.query.RelayState = JSON.stringify({ fromQA, returnTo });
    }
    else if (fromQR) {
        const eventKey = req.query.eventKey;
        req.query.RelayState = JSON.stringify({ fromQR, eventKey, returnTo });
    }
    else {
        const token = req.query.token;
        req.query.RelayState = JSON.stringify({ fromQR, token, returnTo });
    }
    next();
}, passport_1.default.authenticate('saml'));
exports.authRoute.post('/callback', express_1.default.urlencoded({ extended: false }), passport_1.default.authenticate('saml'), function (req, res) {
    const relayState = req.body.RelayState
        ? JSON.parse(req.body.RelayState)
        : null;
    // QA forum flow - issue JWT and redirect back to QA site
    if (relayState && relayState.fromQA === 'true') {
        const token = getJWT(req.user);
        return res.redirect(`${process.env.BASE_URL}/#/submitAnswer/${token}`);
    }
    // QR flow
    if (relayState && relayState.fromQR === 'true' && relayState.returnTo) {
        return res.redirect(`${process.env.BASE_URL}${relayState.returnTo}`);
    }
    // QA / token flow
    if (relayState && relayState.token && relayState.returnTo) {
        return res.redirect(`${process.env.BASE_URL}/#${relayState.returnTo}`);
    }
    // Default login
    return res.redirect(process.env.BASE_URL);
});
exports.authRoute.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err)
            return next(err);
        res.sendStatus(200);
    });
});
