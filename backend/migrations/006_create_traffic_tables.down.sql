-- Drop triggers
DROP TRIGGER IF EXISTS transport_alerts_updated_at ON transport_alerts;
DROP TRIGGER IF EXISTS traffic_incidents_updated_at ON traffic_incidents;

-- Drop function
DROP FUNCTION IF EXISTS update_traffic_updated_at();

-- Drop indexes for transport_alerts
DROP INDEX IF EXISTS idx_transport_alerts_created_at;
DROP INDEX IF EXISTS idx_transport_alerts_active;
DROP INDEX IF EXISTS idx_transport_alerts_line;
DROP INDEX IF EXISTS idx_transport_alerts_status;

-- Drop indexes for traffic_incidents
DROP INDEX IF EXISTS idx_traffic_incidents_source;
DROP INDEX IF EXISTS idx_traffic_incidents_type;
DROP INDEX IF EXISTS idx_traffic_incidents_created_at;
DROP INDEX IF EXISTS idx_traffic_incidents_severity;
DROP INDEX IF EXISTS idx_traffic_incidents_status;

-- Drop tables
DROP TABLE IF EXISTS transport_alerts;
DROP TABLE IF EXISTS traffic_incidents;