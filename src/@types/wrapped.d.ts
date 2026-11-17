declare global {
  interface WrappedStats {
    period: {
      label: string; // "2025–2026"
      startDate: string; // "YYYY-MM-DD", inclusive, by Event.start
      endDate: string;
    };
    displayName: string; // first word of User.name
    totalEvents: number; // non-system events in period
    totalHours: number; // sum of end - start, 1 decimal
    totalPoints: number; // sum of Event.points
    eventCountsByType: Record<EventCategory, number>; // all keys present
    mostAttendedType: { type: EventCategory; count: number } | null;
    busiestMonth: { month: string; count: number } | null; // "YYYY-MM"
    featuredBadge: {
      name: string;
      description: string;
      image: string;
      shape: BadgeShape;
      tier: Tier | null;
    } | null;
    badgesEarned: number; // User.badges.length (lifetime)
  }
}

export {};
