export function checkAllRounder(user: User): string | null {
  if (user.badges?.includes("All Rounder")) {
    return null;
  }
  const hasAllCategories = (user.n_corporate_events ?? 0) >= 1 && (user.n_explorations_events ?? 0) >= 1 && (user.n_mentoring_events ?? 0) >= 1 && (user.n_social_events ?? 0) >= 1;
 
  return hasAllCategories ? "All Rounder" : null;
}

export function checkHelloWorld(user: User): string | null {
  if (user.badges.includes("Hello World")) {
    return null;
  }
  return (user.n_total_events ?? 0) >= 1 ? "Hello World" : null;
}
