import Badge from '../models/badge';

export async function checkTieredBadge(
  user: User,
  counterField: string,
  tier1: number,
  tier2: number,
  tier3: number
) {
  if (user[counterField] >= tier3) {
    const badge = await Badge.findOne({
      isTiered: true,
      category: counterField,
      tier: 3
    });

    if (badge && !user.badges.includes(badge.name)) {
      return badge.name;
    }
  } else if (user[counterField] >= tier2) {
    const badge = await Badge.findOne({
      isTiered: true,
      category: counterField,
      tier: 2
    });

    if (badge && !user.badges.includes(badge.name)) {
      return badge.name;
    }
  } else if (user[counterField] >= tier1) {
    const badge = await Badge.findOne({
      isTiered: true,
      category: counterField,
      tier: 1
    });

    if (badge && !user.badges.includes(badge.name)) {
      return badge.name;
    }
  }

  return null;
}
