-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL CHECK (length(title) >= 3 AND length(title) <= 255),
    description TEXT NOT NULL CHECK (length(description) >= 10 AND length(description) <= 5000),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    location VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url TEXT,
    price VARCHAR(50),
    is_free BOOLEAN DEFAULT false,
    organizer_name VARCHAR(255),
    organizer_contact VARCHAR(255),
    ticket_url TEXT,
    max_capacity INT CHECK (max_capacity IS NULL OR max_capacity > 0),
    going_count INT DEFAULT 0 CHECK (going_count >= 0),
    interested_count INT DEFAULT 0 CHECK (interested_count >= 0),
    source VARCHAR(50) DEFAULT 'user' CHECK (source IN ('user', 'openagenda')),
    external_id VARCHAR(255),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT false
);

-- Event RSVPs table (Going/Interested)
CREATE TABLE event_rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('going', 'interested')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_events_city ON events(city);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_is_deleted ON events(is_deleted) WHERE is_deleted = false;
CREATE INDEX idx_events_source ON events(source);
CREATE INDEX idx_events_external_id ON events(external_id) WHERE external_id IS NOT NULL;

CREATE INDEX idx_event_rsvps_event_id ON event_rsvps(event_id);
CREATE INDEX idx_event_rsvps_user_id ON event_rsvps(user_id);
CREATE INDEX idx_event_rsvps_status ON event_rsvps(status);

-- Trigger to update events.updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update event_rsvps.updated_at
CREATE TRIGGER update_event_rsvps_updated_at BEFORE UPDATE ON event_rsvps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment event going_count
CREATE OR REPLACE FUNCTION increment_event_going()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'going' THEN
        UPDATE events SET going_count = going_count + 1 WHERE id = NEW.event_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_going_added AFTER INSERT ON event_rsvps
    FOR EACH ROW EXECUTE FUNCTION increment_event_going();

-- Function to decrement event going_count
CREATE OR REPLACE FUNCTION decrement_event_going()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'going' THEN
        UPDATE events SET going_count = going_count - 1 WHERE id = OLD.event_id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_going_removed AFTER DELETE ON event_rsvps
    FOR EACH ROW EXECUTE FUNCTION decrement_event_going();

-- Function to increment event interested_count
CREATE OR REPLACE FUNCTION increment_event_interested()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'interested' THEN
        UPDATE events SET interested_count = interested_count + 1 WHERE id = NEW.event_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_interested_added AFTER INSERT ON event_rsvps
    FOR EACH ROW EXECUTE FUNCTION increment_event_interested();

-- Function to decrement event interested_count
CREATE OR REPLACE FUNCTION decrement_event_interested()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'interested' THEN
        UPDATE events SET interested_count = interested_count - 1 WHERE id = OLD.event_id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_interested_removed AFTER DELETE ON event_rsvps
    FOR EACH ROW EXECUTE FUNCTION decrement_event_interested();

-- Function to handle RSVP status changes
CREATE OR REPLACE FUNCTION handle_event_rsvp_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != NEW.status THEN
        -- Decrement old status count
        IF OLD.status = 'going' THEN
            UPDATE events SET going_count = going_count - 1 WHERE id = OLD.event_id;
        ELSIF OLD.status = 'interested' THEN
            UPDATE events SET interested_count = interested_count - 1 WHERE id = OLD.event_id;
        END IF;
        
        -- Increment new status count
        IF NEW.status = 'going' THEN
            UPDATE events SET going_count = going_count + 1 WHERE id = NEW.event_id;
        ELSIF NEW.status = 'interested' THEN
            UPDATE events SET interested_count = interested_count + 1 WHERE id = NEW.event_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_rsvp_status_changed AFTER UPDATE ON event_rsvps
    FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION handle_event_rsvp_status_change();