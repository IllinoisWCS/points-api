import express from 'express';
import User from '../models/user';
import Event from '../models/event';

export const wrappedRoute = express.Router();

// the event categories from enum
const CATEGORIES = (
  Event.schema.path('category') as unknown as { enumValues: EventCategory[] }
).enumValues;

// school year is from august 24 to may 5th for UIUC, so that's included
function getCurrentPeriod(now = new Date()) {
// 0 = Jan
  const year = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  return {
    label: `${year}–${year + 1}`,
    startDate: `${year}-08-24`,
    endDate: `${year + 1}-05-05`,
    start: new Date(`${year}-08-24T00:00:00-05:00`),
    endExclusive: new Date(`${year + 1}-05-05T00:00:00-05:00`)
  };
}

// GET /wrapped from session
wrappedRoute.get('/', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) return res.sendStatus(404);

    const period = getCurrentPeriod();

    // events
    const events = await Event.find({
      _id: { $in: user.events ?? [] },
      isSystem: { $ne: true },
      start: { $gte: period.start, $lt: period.endExclusive }
    }).lean();

    // number of events
    const eventCountsByType = Object.fromEntries(
      CATEGORIES.map((category) => [category, 0])
    ) as Record<EventCategory, number>;

    let totalPoints = 0;
    for (const event of events) {
      eventCountsByType[event.category] += 1;
      totalPoints += event.points;
    }

    //most attended event by alphabetics
    let mostAttendedType: WrappedStats['mostAttendedType'] = null;
    if (events.length > 0) {
      const top = [...CATEGORIES].sort(
        (a, b) =>
          eventCountsByType[b] - eventCountsByType[a] || a.localeCompare(b)
      )[0];
      mostAttendedType = { type: top, count: eventCountsByType[top] };
    }

    const stats: WrappedStats = {
      period: {
        label: period.label,
        startDate: period.startDate,
        endDate: period.endDate
      },
      displayName: (user.name ?? '').trim().split(/\s+/)[0],
      totalEvents: events.length,
      totalPoints: Math.round(totalPoints * 10) / 10,
      eventCountsByType,
      mostAttendedType,

     // mock
      totalHours: 21.5,
      busiestMonth: { month: '2026-10', count: 4 },
      featuredBadge: {
        name: 'Mentoring Guide!',
        description: 'Attended many WCS mentorship sessions. Awesome job!!!',
        image: 'mentoring_guide.png',
        shape: 'hexagon',
        tier: 2
      },
      badgesEarned: user.badges?.length ?? 0
    };

    return res.status(200).send(stats);
  } catch (err) {
    return next(err);
  }
});