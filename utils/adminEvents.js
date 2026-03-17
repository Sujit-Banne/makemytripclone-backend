const EventEmitter = require('events');

class AdminEvents extends EventEmitter {}

// Single shared emitter for admin dashboard updates.
const adminEvents = new AdminEvents();

module.exports = adminEvents;
