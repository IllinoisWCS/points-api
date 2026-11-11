import Event from '../models/event';

const event = new Event({
  key: 'test123',
  name: 'Test Open Office',
  category: 'openOffice',
  points: 0.5,
  start: new Date('2026-11-10T14:00:00'),
  end: new Date('2026-11-10T17:30:00'),
  private: false,
  isSystem: false
});

const error = event.validateSync();

if (error) {
  console.log('Validation failed:', error.message);
} else {
  console.log('Validation passed!');
}
