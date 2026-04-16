import Badge from '../models/badge';

export async function checkTieredBadge(user: User, counterField: string, tier1: number, tier2: number, tier3: number) {
    if (user[counterField] >= tier3) {
        let badge = await Badge.findOne({isTiered: true, category: counterField, tier: 3}).name;
        if (user.badges.includes(badge) == false) {
            return badge;
        }
    } else if (user[counterField] >= tier2) {
        let badge = await Badge.findOne({isTiered: true, category: counterField, tier: 2}).name;
        if (user.badges.includes(badge) == false) {
            return badge;
        }
    } else if (user[counterField] >= tier1) {
        let badge = await Badge.findOne({isTiered: true, category: counterField, tier: 1}).name;
        if (user.badges.includes(badge) == false) {
            return badge;
        }
    }
    return null;
};