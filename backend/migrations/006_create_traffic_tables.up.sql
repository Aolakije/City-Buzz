-- Create traffic incidents table
CREATE TABLE IF NOT EXISTS traffic_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('accident', 'construction', 'closure', 'delay')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('minor', 'moderate', 'severe')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    source VARCHAR(50) NOT NULL CHECK (source IN ('api', 'user_report')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
    duration_estimate VARCHAR(100),
    reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    is_verified BOOLEAN DEFAULT false,
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Create transport alerts table
CREATE TABLE IF NOT EXISTS transport_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    line_type VARCHAR(20) NOT NULL CHECK (line_type IN ('metro', 'bus', 'train')),
    line_number VARCHAR(50),
    line_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('onTime', 'delayed', 'disrupted')),
    description TEXT NOT NULL,
    affected_stops TEXT[],
    source VARCHAR(50) NOT NULL DEFAULT 'api',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Create indexes for traffic_incidents
CREATE INDEX idx_traffic_incidents_status ON traffic_incidents(status) WHERE status = 'active';
CREATE INDEX idx_traffic_incidents_severity ON traffic_incidents(severity);
CREATE INDEX idx_traffic_incidents_created_at ON traffic_incidents(created_at DESC);
CREATE INDEX idx_traffic_incidents_type ON traffic_incidents(type);
CREATE INDEX idx_traffic_incidents_source ON traffic_incidents(source);

-- Create indexes for transport_alerts
CREATE INDEX idx_transport_alerts_status ON transport_alerts(status);
CREATE INDEX idx_transport_alerts_line ON transport_alerts(line_type, line_number);
CREATE INDEX idx_transport_alerts_active ON transport_alerts(is_active) WHERE is_active = true;
CREATE INDEX idx_transport_alerts_created_at ON transport_alerts(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_traffic_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER traffic_incidents_updated_at
    BEFORE UPDATE ON traffic_incidents
    FOR EACH ROW
    EXECUTE FUNCTION update_traffic_updated_at();

CREATE TRIGGER transport_alerts_updated_at
    BEFORE UPDATE ON transport_alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_traffic_updated_at();