const CATEGORY_DEFAULTS: Record<string, number> = {
  corporate: 1,
  explorations: 1,
  mentoring: 1,
  social: 1
};

export function getEventHours(event: Event): number {
  const start = new Date(event.start);
  const end = new Date(event.end);

  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (sameDay && hours > 0 && hours < 6) {
    return hours;
  }

  return CATEGORY_DEFAULTS[event.category];
}
