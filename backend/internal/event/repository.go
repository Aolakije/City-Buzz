package event

import (
	"context"
	"fmt"
	"time"

	"github.com/Aolakije/City-Buzz/internal/models"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	// Event CRUD
	Create(ctx context.Context, event *models.Event) error
	GetByID(ctx context.Context, id uuid.UUID) (*models.Event, error)
	GetByCity(ctx context.Context, city, category string, limit, offset int) ([]*models.Event, error)
	GetUpcoming(ctx context.Context, city, category string, limit, offset int) ([]*models.Event, error)
	Update(ctx context.Context, id uuid.UUID, event *models.Event) error
	Delete(ctx context.Context, id uuid.UUID) error
	GetUserEvents(ctx context.Context, userID uuid.UUID) ([]*models.Event, error)

	// RSVP operations
	CreateOrUpdateRSVP(ctx context.Context, rsvp *models.EventRSVP) error
	DeleteRSVP(ctx context.Context, eventID, userID uuid.UUID) error
	GetUserRSVP(ctx context.Context, eventID, userID uuid.UUID) (*models.EventRSVP, error)
	GetEventRSVPs(ctx context.Context, eventID uuid.UUID, status string) ([]*models.EventRSVP, error)
	GetUserRSVPs(ctx context.Context, userID uuid.UUID, status string) ([]*models.EventRSVP, error)
	GetEventAttendees(ctx context.Context, eventID uuid.UUID) (*models.EventAttendeesResponse, error) // ADD THIS LINE

}

type repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, event *models.Event) error {
	query := `
        INSERT INTO events (
            id, title, description, start_date, end_date, location, address, city, category,
            event_type, image_url, price, is_free, organizer_name, organizer_contact, ticket_url,
            max_capacity, source, external_id, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            start_date = EXCLUDED.start_date,
            end_date = EXCLUDED.end_date,
            location = EXCLUDED.location,
            address = EXCLUDED.address,
            city = EXCLUDED.city,
            category = EXCLUDED.category,
            event_type = EXCLUDED.event_type,
            image_url = EXCLUDED.image_url,
            updated_at = NOW()
        RETURNING created_at, updated_at, going_count, interested_count, is_deleted
    `

	return r.db.QueryRow(ctx, query,
		event.ID, event.Title, event.Description, event.StartDate, event.EndDate, event.Location,
		event.Address, event.City, event.Category, event.EventType, event.ImageURL, event.Price, event.IsFree,
		event.OrganizerName, event.OrganizerContact, event.TicketURL, event.MaxCapacity,
		event.Source, event.ExternalID, event.CreatedBy,
	).Scan(&event.CreatedAt, &event.UpdatedAt, &event.GoingCount, &event.InterestedCount, &event.IsDeleted)
}

func (r *repository) GetByID(ctx context.Context, id uuid.UUID) (*models.Event, error) {
	query := `
		SELECT id, title, description, start_date, end_date, location, address, city, category,
			   event_type, image_url, price, is_free, organizer_name, organizer_contact, ticket_url,
			   max_capacity, going_count, interested_count, source, external_id, created_by,
			   created_at, updated_at, is_deleted
		FROM events
		WHERE id = $1 AND is_deleted = false
	`

	event := &models.Event{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&event.ID, &event.Title, &event.Description, &event.StartDate, &event.EndDate,
		&event.Location, &event.Address, &event.City, &event.Category, &event.EventType, &event.ImageURL,
		&event.Price, &event.IsFree, &event.OrganizerName, &event.OrganizerContact,
		&event.TicketURL, &event.MaxCapacity, &event.GoingCount, &event.InterestedCount,
		&event.Source, &event.ExternalID, &event.CreatedBy, &event.CreatedAt,
		&event.UpdatedAt, &event.IsDeleted,
	)

	if err != nil {
		return nil, err
	}

	return event, nil
}

func (r *repository) GetByCity(ctx context.Context, city, category string, limit, offset int) ([]*models.Event, error) {
	query := `
		SELECT id, title, description, start_date, end_date, location, address, city, category,
			   event_type, image_url, price, is_free, organizer_name, organizer_contact, ticket_url,
			   max_capacity, going_count, interested_count, source, external_id, created_by,
			   created_at, updated_at, is_deleted
		FROM events
		WHERE LOWER(city) = LOWER($1) AND is_deleted = false
	`

	args := []interface{}{city}
	argCount := 1

	if category != "" {
		argCount++
		query += fmt.Sprintf(" AND category = $%d", argCount)
		args = append(args, category)
	}

	query += " ORDER BY start_date ASC"

	if limit > 0 {
		argCount++
		query += fmt.Sprintf(" LIMIT $%d", argCount)
		args = append(args, limit)
	}

	if offset > 0 {
		argCount++
		query += fmt.Sprintf(" OFFSET $%d", argCount)
		args = append(args, offset)
	}

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	events := []*models.Event{}
	for rows.Next() {
		event := &models.Event{}
		err := rows.Scan(
			&event.ID, &event.Title, &event.Description, &event.StartDate, &event.EndDate,
			&event.Location, &event.Address, &event.City, &event.Category, &event.EventType, &event.ImageURL,
			&event.Price, &event.IsFree, &event.OrganizerName, &event.OrganizerContact,
			&event.TicketURL, &event.MaxCapacity, &event.GoingCount, &event.InterestedCount,
			&event.Source, &event.ExternalID, &event.CreatedBy, &event.CreatedAt,
			&event.UpdatedAt, &event.IsDeleted,
		)
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	return events, rows.Err()
}

func (r *repository) GetUpcoming(ctx context.Context, city, category string, limit, offset int) ([]*models.Event, error) {
	query := `
		SELECT id, title, description, start_date, end_date, location, address, city, category,
			   event_type, image_url, price, is_free, organizer_name, organizer_contact, ticket_url,
			   max_capacity, going_count, interested_count, source, external_id, created_by,
			   created_at, updated_at, is_deleted
		FROM events
		WHERE start_date >= $1 AND is_deleted = false
	`

	args := []interface{}{time.Now()}
	argCount := 1

	if city != "" {
		argCount++
		query += fmt.Sprintf(" AND LOWER(city) = LOWER($%d)", argCount)
		args = append(args, city)
	}

	if category != "" {
		argCount++
		query += fmt.Sprintf(" AND category = $%d", argCount)
		args = append(args, category)
	}

	query += " ORDER BY start_date ASC"

	if limit > 0 {
		argCount++
		query += fmt.Sprintf(" LIMIT $%d", argCount)
		args = append(args, limit)
	}

	if offset > 0 {
		argCount++
		query += fmt.Sprintf(" OFFSET $%d", argCount)
		args = append(args, offset)
	}

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	events := []*models.Event{}
	for rows.Next() {
		event := &models.Event{}
		err := rows.Scan(
			&event.ID, &event.Title, &event.Description, &event.StartDate, &event.EndDate,
			&event.Location, &event.Address, &event.City, &event.Category, &event.EventType, &event.ImageURL,
			&event.Price, &event.IsFree, &event.OrganizerName, &event.OrganizerContact,
			&event.TicketURL, &event.MaxCapacity, &event.GoingCount, &event.InterestedCount,
			&event.Source, &event.ExternalID, &event.CreatedBy, &event.CreatedAt,
			&event.UpdatedAt, &event.IsDeleted,
		)
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	return events, rows.Err()
}

func (r *repository) Update(ctx context.Context, id uuid.UUID, event *models.Event) error {
	query := `
		UPDATE events
		SET title = $1, description = $2, start_date = $3, end_date = $4, location = $5,
			address = $6, city = $7, category = $8, event_type = $9, image_url = $10, price = $11, is_free = $12,
			organizer_name = $13, organizer_contact = $14, ticket_url = $15, max_capacity = $16,
			updated_at = NOW()
		WHERE id = $17 AND is_deleted = false
		RETURNING updated_at
	`

	return r.db.QueryRow(ctx, query,
		event.Title, event.Description, event.StartDate, event.EndDate, event.Location,
		event.Address, event.City, event.Category, event.EventType, event.ImageURL, event.Price, event.IsFree,
		event.OrganizerName, event.OrganizerContact, event.TicketURL, event.MaxCapacity, id,
	).Scan(&event.UpdatedAt)
}

func (r *repository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `UPDATE events SET is_deleted = true, updated_at = NOW() WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

func (r *repository) GetUserEvents(ctx context.Context, userID uuid.UUID) ([]*models.Event, error) {
	query := `
		SELECT id, title, description, start_date, end_date, location, address, city, category,
			   event_type, image_url, price, is_free, organizer_name, organizer_contact, ticket_url,
			   max_capacity, going_count, interested_count, source, external_id, created_by,
			   created_at, updated_at, is_deleted
		FROM events
		WHERE created_by = $1 AND is_deleted = false
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	events := []*models.Event{}
	for rows.Next() {
		event := &models.Event{}
		err := rows.Scan(
			&event.ID, &event.Title, &event.Description, &event.StartDate, &event.EndDate,
			&event.Location, &event.Address, &event.City, &event.Category, &event.EventType, &event.ImageURL,
			&event.Price, &event.IsFree, &event.OrganizerName, &event.OrganizerContact,
			&event.TicketURL, &event.MaxCapacity, &event.GoingCount, &event.InterestedCount,
			&event.Source, &event.ExternalID, &event.CreatedBy, &event.CreatedAt,
			&event.UpdatedAt, &event.IsDeleted,
		)
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	return events, rows.Err()
}

// RSVP Methods

func (r *repository) CreateOrUpdateRSVP(ctx context.Context, rsvp *models.EventRSVP) error {
	query := `
		INSERT INTO event_rsvps (event_id, user_id, status)
		VALUES ($1, $2, $3)
		ON CONFLICT (event_id, user_id)
		DO UPDATE SET status = $3, updated_at = NOW()
		RETURNING id, created_at, updated_at
	`

	return r.db.QueryRow(ctx, query, rsvp.EventID, rsvp.UserID, rsvp.Status).Scan(
		&rsvp.ID, &rsvp.CreatedAt, &rsvp.UpdatedAt,
	)
}

func (r *repository) DeleteRSVP(ctx context.Context, eventID, userID uuid.UUID) error {
	query := `DELETE FROM event_rsvps WHERE event_id = $1 AND user_id = $2`
	_, err := r.db.Exec(ctx, query, eventID, userID)
	return err
}

func (r *repository) GetUserRSVP(ctx context.Context, eventID, userID uuid.UUID) (*models.EventRSVP, error) {
	query := `
		SELECT id, event_id, user_id, status, created_at, updated_at
		FROM event_rsvps
		WHERE event_id = $1 AND user_id = $2
	`

	rsvp := &models.EventRSVP{}
	err := r.db.QueryRow(ctx, query, eventID, userID).Scan(
		&rsvp.ID, &rsvp.EventID, &rsvp.UserID, &rsvp.Status, &rsvp.CreatedAt, &rsvp.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return rsvp, nil
}

func (r *repository) GetEventRSVPs(ctx context.Context, eventID uuid.UUID, status string) ([]*models.EventRSVP, error) {
	query := `
		SELECT id, event_id, user_id, status, created_at, updated_at
		FROM event_rsvps
		WHERE event_id = $1
	`

	args := []interface{}{eventID}
	if status != "" {
		query += " AND status = $2"
		args = append(args, status)
	}

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	rsvps := []*models.EventRSVP{}
	for rows.Next() {
		rsvp := &models.EventRSVP{}
		err := rows.Scan(&rsvp.ID, &rsvp.EventID, &rsvp.UserID, &rsvp.Status, &rsvp.CreatedAt, &rsvp.UpdatedAt)
		if err != nil {
			return nil, err
		}
		rsvps = append(rsvps, rsvp)
	}

	return rsvps, rows.Err()
}

func (r *repository) GetUserRSVPs(ctx context.Context, userID uuid.UUID, status string) ([]*models.EventRSVP, error) {
	query := `
		SELECT id, event_id, user_id, status, created_at, updated_at
		FROM event_rsvps
		WHERE user_id = $1
	`

	args := []interface{}{userID}
	if status != "" {
		query += " AND status = $2"
		args = append(args, status)
	}

	query += " ORDER BY created_at DESC"

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	rsvps := []*models.EventRSVP{}
	for rows.Next() {
		rsvp := &models.EventRSVP{}
		err := rows.Scan(&rsvp.ID, &rsvp.EventID, &rsvp.UserID, &rsvp.Status, &rsvp.CreatedAt, &rsvp.UpdatedAt)
		if err != nil {
			return nil, err
		}
		rsvps = append(rsvps, rsvp)
	}

	return rsvps, rows.Err()
}
func (r *repository) GetEventAttendees(ctx context.Context, eventID uuid.UUID) (*models.EventAttendeesResponse, error) {
	query := `
        SELECT 
            u.id, u.username, u.first_name, u.last_name, u.avatar_url,
            er.status, er.created_at
        FROM event_rsvps er
        JOIN users u ON er.user_id = u.id
        WHERE er.event_id = $1
        ORDER BY er.created_at DESC
    `

	rows, err := r.db.Query(ctx, query, eventID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	going := []*models.EventAttendee{}
	interested := []*models.EventAttendee{}

	for rows.Next() {
		attendee := &models.EventAttendee{}
		err := rows.Scan(
			&attendee.UserID,
			&attendee.Username,
			&attendee.FirstName,
			&attendee.LastName,
			&attendee.AvatarURL,
			&attendee.Status,
			&attendee.RSVPedAt,
		)
		if err != nil {
			return nil, err
		}

		if attendee.Status == "going" {
			going = append(going, attendee)
		} else if attendee.Status == "interested" {
			interested = append(interested, attendee)
		}
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &models.EventAttendeesResponse{
		Going:           going,
		Interested:      interested,
		GoingCount:      len(going),
		InterestedCount: len(interested),
	}, nil
}
