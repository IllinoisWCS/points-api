"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndAwardBadges = exports.checkTieredBadge = exports.checkHelloWorld = exports.checkAllRounder = void 0;
const badge_1 = __importDefault(require("../models/badge"));
function checkAllRounder(user) {
    if (user.badges?.includes('All Rounder')) {
        return null;
    }
    const hasAllCategories = (user.n_corporate_events ?? 0) >= 1 &&
        (user.n_explorations_events ?? 0) >= 1 &&
        (user.n_mentoring_events ?? 0) >= 1 &&
        (user.n_social_events ?? 0) >= 1;
    return hasAllCategories ? 'All Rounder' : null;
}
exports.checkAllRounder = checkAllRounder;
function checkHelloWorld(user) {
    if (user.badges?.includes('Hello World')) {
        return null;
    }
    return (user.n_total_events ?? 0) >= 1 ? 'Hello World' : null;
}
exports.checkHelloWorld = checkHelloWorld;
async function checkTieredBadge(user, counterField, tier1, tier2, tier3) {
    if (user[counterField] >= tier3) {
        const badge = await badge_1.default.findOne({
            isTiered: true,
            category: counterField,
            tier: 3
        });
        if (badge && !user.badges?.includes(badge.name)) {
            return badge.name;
        }
    }
    else if (user[counterField] >= tier2) {
        const badge = await badge_1.default.findOne({
            isTiered: true,
            category: counterField,
            tier: 2
        });
        if (badge && !user.badges?.includes(badge.name)) {
            return badge.name;
        }
    }
    else if (user[counterField] >= tier1) {
        const badge = await badge_1.default.findOne({
            isTiered: true,
            category: counterField,
            tier: 1
        });
        if (badge && !user.badges?.includes(badge.name)) {
            return badge.name;
        }
    }
    return null;
}
exports.checkTieredBadge = checkTieredBadge;
async function checkAndAwardBadges(user, eventType) {
    const categoryMap = {
        corporate: 'n_corporate_events',
        explorations: 'n_explorations_events',
        mentoring: 'n_mentoring_events',
        social: 'n_social_events'
    };
    const counterField = categoryMap[eventType];
    const results = await Promise.all([
        checkAllRounder(user),
        checkHelloWorld(user),
        counterField ? checkTieredBadge(user, counterField, 1, 3, 5) : null
    ]);
    return results.filter((badge) => badge !== null);
}
exports.checkAndAwardBadges = checkAndAwardBadges;
