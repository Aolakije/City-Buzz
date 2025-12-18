-- Drop triggers
DROP TRIGGER IF EXISTS event_rsvp_status_changed ON event_rsvps;
DROP TRIGGER IF EXISTS event_interested_removed ON event_rsvps;
DROP TRIGGER IF EXISTS event_interested_added ON event_rsvps;
DROP TRIGGER IF EXISTS event_going_removed ON event_rsvps;
DROP TRIGGER IF EXISTS event_going_added ON event_rsvps;
DROP TRIGGER IF EXISTS update_event_rsvps_updated_at ON event_rsvps;
DROP TRIGGER IF EXISTS update_events_updated_at ON events;

-- Drop functions
DROP FUNCTION IF EXISTS handle_event_rsvp_status_change();
DROP FUNCTION IF EXISTS decrement_event_interested();
DROP FUNCTION IF EXISTS increment_event_interested();
DROP FUNCTION IF EXISTS decrement_event_going();
DROP FUNCTION IF EXISTS increment_event_going();

-- Drop tables
DROP TABLE IF EXISTS event_rsvps;
DROP TABLE IF EXISTS events;