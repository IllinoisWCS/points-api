// Global type, same style as event.d.ts / badge.d.ts.
// Reuses EventCategory (event.d.ts) and BadgeShape / Tier (badge.d.ts).

declare global {
  interface WrappedStats {
    period: {
      label: string; // 2026–2027
      startDate: string; // YYYY-MM-DD
      endDate: string;
    };
    displayName: string; // User.name first word
    totalEvents: number; 
    totalHours: number;
    totalPoints: number; // sum of Event.points
    eventCountsByType: Record<EventCategory, number>; // a
    mostAttendedType: { type: EventCategory; count: number } | null; //
    busiestMonth: { month: string; count: number } | null; // YYYY-MM
    featuredBadge: {
      name: string;
      description: string;
      image: string;
      shape: BadgeShape;
      tier: Tier | null;
    } | null;
    badgesEarned: number; // User.badges.length during their entire time at WCS
  }
}

export {};
