import Badge from '../models/badge';

export function checkAllRounder(user: User): string | null {
  if (user.badges?.includes('All Rounder')) {
    return null;
  }
  const hasAllCategories =
    (user.n_corporate_events ?? 0) >= 1 &&
    (user.n_explorations_events ?? 0) >= 1 &&
    (user.n_mentoring_events ?? 0) >= 1 &&
    (user.n_social_events ?? 0) >= 1;

  return hasAllCategories ? 'All Rounder' : null;
}

export function checkHelloWorld(user: User): string | null {
  if (user.badges.includes('Hello World')) {
    return null;
  }
  return (user.n_total_events ?? 0) >= 1 ? 'Hello World' : null;
}

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

export async function checkAndAwardBadges(
  user: User,
  eventType: string
): Promise<string[]> {
  const categoryMap: Record<string, string> = {
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
  return results.filter((badge): badge is string => badge !== null);
}
