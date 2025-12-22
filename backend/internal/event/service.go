package event

import (
	"context"
	"fmt"
	"log"
	"sort"
	"time"

	"github.com/Aolakije/City-Buzz/internal/event/adapters"
	"github.com/Aolakije/City-Buzz/internal/models"
	"github.com/Aolakije/City-Buzz/pkg/config"
	"github.com/google/uuid"
)

type Service interface {
	// Event operations
	CreateEvent(ctx context.Context, req *models.CreateEventRequest, userID uuid.UUID) (*models.Event, error)
	GetEvent(ctx context.Context, id uuid.UUID) (*models.Event, error)
	GetEventsByCity(ctx context.Context, city, category, language string, page, pageSize int) ([]*models.Event, error)
	GetUpcomingEvents(ctx context.Context, city, category, language string, page, pageSize int) ([]*models.Event, error)
	GetTrendingEvents(ctx context.Context, city string, limit int) ([]*models.Event, error)
	UpdateEvent(ctx context.Context, id uuid.UUID, req *models.UpdateEventRequest, userID uuid.UUID) (*models.Event, error)
	DeleteEvent(ctx context.Context, id uuid.UUID, userID uuid.UUID) error
	GetUserEvents(ctx context.Context, userID uuid.UUID) ([]*models.Event, error)
	GetEventsStructured(ctx context.Context, city, category, language string, page, pageSize int) (*models.EventsResponse, error)

	// RSVP operations
	CreateOrUpdateRSVP(ctx context.Context, eventID, userID uuid.UUID, status string) error
	DeleteRSVP(ctx context.Context, eventID, userID uuid.UUID) error
	GetUserRSVP(ctx context.Context, eventID, userID uuid.UUID) (*models.EventRSVP, error)
	GetUserRSVPs(ctx context.Context, userID uuid.UUID, status string) ([]*models.EventRSVP, error)
	GetEventAttendees(ctx context.Context, eventID uuid.UUID) (*models.EventAttendeesResponse, error) // ADD THIS LINE
}

type service struct {
	repo              Repository
	openAgendaAdapter adapters.OpenAgendaAdapter
	config            *config.Config
}

func NewService(repo Repository, cfg *config.Config) Service {
	return &service{
		repo:              repo,
		openAgendaAdapter: adapters.NewOpenAgendaAdapter(cfg),
		config:            cfg,
	}
}

func (s *service) CreateEvent(ctx context.Context, req *models.CreateEventRequest, userID uuid.UUID) (*models.Event, error) {
	event := &models.Event{
		ID:               uuid.New(),
		Title:            req.Title,
		Description:      req.Description,
		StartDate:        req.StartDate,
		EndDate:          req.EndDate,
		Location:         req.Location,
		Address:          req.Address,
		City:             req.City,
		Category:         req.Category,
		EventType:        req.EventType,
		ImageURL:         req.ImageURL,
		Price:            req.Price,
		IsFree:           req.IsFree,
		OrganizerName:    req.OrganizerName,
		OrganizerContact: req.OrganizerContact,
		TicketURL:        req.TicketURL,
		MaxCapacity:      req.MaxCapacity,
		Source:           "user",
		CreatedBy:        &userID,
	}

	if err := s.repo.Create(ctx, event); err != nil {
		return nil, fmt.Errorf("failed to create event: %w", err)
	}

	return event, nil
}

func (s *service) GetEvent(ctx context.Context, id uuid.UUID) (*models.Event, error) {
	event, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get event: %w", err)
	}
	return event, nil
}

func (s *service) GetEventsByCity(ctx context.Context, city, category, language string, page, pageSize int) ([]*models.Event, error) {
	offset := (page - 1) * pageSize

	// Get events from database
	dbEvents, err := s.repo.GetByCity(ctx, city, category, pageSize/2, offset/2)
	if err != nil {
		return nil, fmt.Errorf("failed to get events from database: %w", err)
	}

	// Get events from OpenAgenda
	oaEvents, err := s.openAgendaAdapter.FetchEvents(ctx, city, category, pageSize/2)
	if err != nil {
		// Log error but continue with DB events
		fmt.Printf("Warning: failed to fetch OpenAgenda events: %v\n", err)
		return dbEvents, nil
	}

	// Merge events (DB events first, then OpenAgenda)
	allEvents := append(dbEvents, oaEvents...)

	// Sort by start date
	// TODO: Implement sorting if needed

	return allEvents, nil
}

func (s *service) GetUpcomingEvents(ctx context.Context, city, category, language string, page, pageSize int) ([]*models.Event, error) {
	offset := (page - 1) * pageSize

	// Fetch MORE events from OpenAgenda to account for filtering (fetch 2x)
	fetchLimit := pageSize * 2
	if fetchLimit < 150 {
		fetchLimit = 150 // Minimum 150 to ensure enough after filtering
	}

	// Get events from OpenAgenda
	oaEvents, err := s.openAgendaAdapter.FetchEvents(ctx, city, category, fetchLimit)
	if err != nil {
		fmt.Printf("Warning: failed to fetch OpenAgenda events: %v\n", err)
		oaEvents = []*models.Event{}
	}

	// Get events from database (user-created events)
	dbEvents, err := s.repo.GetUpcoming(ctx, "", category, pageSize/4, offset/4)
	if err != nil {
		fmt.Printf("Warning: failed to get DB events: %v\n", err)
		dbEvents = []*models.Event{}
	}

	// Merge all events
	allEvents := append(dbEvents, oaEvents...)

	// Split into CURRENT (today/past) and UPCOMING (future)
	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	tomorrow := today.AddDate(0, 0, 1)

	currentEvents := []*models.Event{}
	upcomingEvents := []*models.Event{}

	for _, event := range allEvents {
		if event.StartDate.Before(tomorrow) {
			// Event is today or in the past
			currentEvents = append(currentEvents, event)
		} else {
			// Event is in the future
			upcomingEvents = append(upcomingEvents, event)
		}
	}

	// Sort CURRENT by newest first (most recent at top)
	sort.Slice(currentEvents, func(i, j int) bool {
		return currentEvents[i].StartDate.After(currentEvents[j].StartDate)
	})

	// Sort UPCOMING by closest date first (soonest upcoming at top)
	sort.Slice(upcomingEvents, func(i, j int) bool {
		return upcomingEvents[i].StartDate.Before(upcomingEvents[j].StartDate)
	})

	// Limit results
	if len(currentEvents) > pageSize {
		currentEvents = currentEvents[:pageSize]
	}
	if len(upcomingEvents) > 20 {
		upcomingEvents = upcomingEvents[:20] // Limit upcoming for carousel
	}

	return append(currentEvents, upcomingEvents...), nil
}

// Add this helper function to your service.go

func (s *service) enrichEventsWithRSVPCounts(ctx context.Context, events []*models.Event) error {
	// Create a map of event IDs
	eventIDs := make([]uuid.UUID, 0, len(events))
	for _, event := range events {
		eventIDs = append(eventIDs, event.ID)
	}
	// Query database for RSVP counts for these events
	// We'll do this efficiently with a single query
	for _, event := range events {
		dbEvent, err := s.repo.GetByID(ctx, event.ID)
		if err != nil {
			// Event not in DB yet, keep counts at 0
			continue
		}

		// Update counts from database
		event.GoingCount = dbEvent.GoingCount
		event.InterestedCount = dbEvent.InterestedCount
	}

	return nil
}

func (s *service) GetEventsStructured(ctx context.Context, city, category, language string, page, pageSize int) (*models.EventsResponse, error) {
	offset := (page - 1) * pageSize

	// UPCOMING CAROUSEL: Always fetch top 20 upcoming events (separate from main feed)
	upcomingOAEvents, err := s.openAgendaAdapter.FetchEvents(ctx, city, "", 50)
	if err != nil {
		fmt.Printf("Warning: failed to fetch upcoming events: %v\n", err)
		upcomingOAEvents = []*models.Event{}
	}

	// MAIN FEED: Fetch ALL available events from OpenAgenda (up to 1000)
	// We fetch once and paginate in-memory
	fetchLimit := 300 // Fetch maximum available
	log.Printf("📊 Fetching %d events from OpenAgenda for pagination", fetchLimit)

	currentOAEvents, err := s.openAgendaAdapter.FetchEvents(ctx, city, category, fetchLimit)
	if err != nil {
		fmt.Printf("Warning: failed to fetch current events: %v\n", err)
		currentOAEvents = []*models.Event{}
	}

	log.Printf("📊 Fetched %d events from OpenAgenda", len(currentOAEvents))

	// Enrich OpenAgenda events with RSVP counts from database
	s.enrichEventsWithRSVPCounts(ctx, currentOAEvents)
	s.enrichEventsWithRSVPCounts(ctx, upcomingOAEvents)

	// Get DB events (user-created)
	dbEvents, err := s.repo.GetUpcoming(ctx, "", category, 1000, 0) // Get all user events
	if err != nil {
		fmt.Printf("Warning: failed to get DB events: %v\n", err)
		dbEvents = []*models.Event{}
	}

	// Deduplicate: Create map with event IDs
	eventMap := make(map[uuid.UUID]*models.Event)

	// Add OpenAgenda events
	for _, event := range currentOAEvents {
		eventMap[event.ID] = event
	}

	// Override with DB events (they have RSVP counts)
	for _, event := range dbEvents {
		eventMap[event.ID] = event
	}

	// Convert map to slice
	allEvents := make([]*models.Event, 0, len(eventMap))
	for _, event := range eventMap {
		allEvents = append(allEvents, event)
	}

	// Filter: Only include events from TODAY onwards (no past events)
	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	currentEvents := make([]*models.Event, 0)
	for _, event := range allEvents {
		if !event.StartDate.Before(today) { // Today or future
			currentEvents = append(currentEvents, event)
		}
	}

	// Sort by date: EARLIEST FIRST (soonest events at top)
	sort.Slice(currentEvents, func(i, j int) bool {
		return currentEvents[i].StartDate.Before(currentEvents[j].StartDate)
	})

	log.Printf("📊 Total events after filtering: %d", len(currentEvents))

	// Apply pagination
	start := offset
	end := offset + pageSize

	paginatedEvents := []*models.Event{}
	if start < len(currentEvents) {
		if end > len(currentEvents) {
			end = len(currentEvents)
		}
		paginatedEvents = currentEvents[start:end]
	}

	log.Printf("📊 Page %d: Returning %d events (from %d to %d)", page, len(paginatedEvents), start, end)

	// Upcoming carousel (separate)
	upcomingMap := make(map[uuid.UUID]*models.Event)
	for _, event := range upcomingOAEvents {
		upcomingMap[event.ID] = event
	}

	upcomingEvents := make([]*models.Event, 0, 20)
	for _, event := range upcomingMap {
		if event.StartDate.After(today) {
			upcomingEvents = append(upcomingEvents, event)
		}
	}

	// Sort upcoming by closest date
	sort.Slice(upcomingEvents, func(i, j int) bool {
		return upcomingEvents[i].StartDate.Before(upcomingEvents[j].StartDate)
	})

	if len(upcomingEvents) > 20 {
		upcomingEvents = upcomingEvents[:20]
	}

	return &models.EventsResponse{
		Current:  paginatedEvents,
		Upcoming: upcomingEvents,
		Total:    len(currentEvents), // Total available events
	}, nil
}

// Update GetTrendingEvents to return TODAY's events ONLY (all categories)
func (s *service) GetTrendingEvents(ctx context.Context, city string, limit int) ([]*models.Event, error) {
	// Get TODAY's events from OpenAgenda (ALL categories)
	oaEvents, err := s.openAgendaAdapter.FetchEvents(ctx, city, "", 100) // Fetch 100, all categories
	if err != nil {
		fmt.Printf("Warning: failed to fetch events for trending: %v\n", err)
		oaEvents = []*models.Event{}
	}

	// Filter to TODAY only
	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	tomorrow := today.AddDate(0, 0, 1)

	todayEvents := []*models.Event{}
	for _, event := range oaEvents {
		if event.StartDate.After(today) && event.StartDate.Before(tomorrow) {
			todayEvents = append(todayEvents, event)
		}
	}

	// Sort by newest first (most recent at top)
	sort.Slice(todayEvents, func(i, j int) bool {
		return todayEvents[i].StartDate.After(todayEvents[j].StartDate)
	})

	// Limit
	if len(todayEvents) > limit {
		todayEvents = todayEvents[:limit]
	}

	return todayEvents, nil
}

func (s *service) UpdateEvent(ctx context.Context, id uuid.UUID, req *models.UpdateEventRequest, userID uuid.UUID) (*models.Event, error) {
	// Get existing event
	event, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("event not found: %w", err)
	}

	// Check if user owns this event
	if event.CreatedBy == nil || *event.CreatedBy != userID {
		return nil, fmt.Errorf("unauthorized: you can only update your own events")
	}

	// Update fields
	if req.Title != nil {
		event.Title = *req.Title
	}
	if req.Description != nil {
		event.Description = *req.Description
	}
	if req.StartDate != nil {
		event.StartDate = *req.StartDate
	}
	if req.EndDate != nil {
		event.EndDate = req.EndDate
	}
	if req.Location != nil {
		event.Location = *req.Location
	}
	if req.Address != nil {
		event.Address = req.Address
	}
	if req.City != nil {
		event.City = *req.City
	}
	if req.Category != nil {
		event.Category = *req.Category
	}
	if req.EventType != nil {
		event.EventType = req.EventType
	}
	if req.ImageURL != nil {
		event.ImageURL = req.ImageURL
	}
	if req.Price != nil {
		event.Price = req.Price
	}
	if req.IsFree != nil {
		event.IsFree = *req.IsFree
	}
	if req.OrganizerName != nil {
		event.OrganizerName = req.OrganizerName
	}
	if req.OrganizerContact != nil {
		event.OrganizerContact = req.OrganizerContact
	}
	if req.TicketURL != nil {
		event.TicketURL = req.TicketURL
	}
	if req.MaxCapacity != nil {
		event.MaxCapacity = req.MaxCapacity
	}

	if err := s.repo.Update(ctx, id, event); err != nil {
		return nil, fmt.Errorf("failed to update event: %w", err)
	}

	return event, nil
}

func (s *service) DeleteEvent(ctx context.Context, id uuid.UUID, userID uuid.UUID) error {
	// Get existing event
	event, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return fmt.Errorf("event not found: %w", err)
	}

	// Check if user owns this event
	if event.CreatedBy == nil || *event.CreatedBy != userID {
		return fmt.Errorf("unauthorized: you can only delete your own events")
	}

	if err := s.repo.Delete(ctx, id); err != nil {
		return fmt.Errorf("failed to delete event: %w", err)
	}

	return nil
}

func (s *service) GetUserEvents(ctx context.Context, userID uuid.UUID) ([]*models.Event, error) {
	events, err := s.repo.GetUserEvents(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user events: %w", err)
	}
	return events, nil
}

func (s *service) CreateOrUpdateRSVP(ctx context.Context, eventID, userID uuid.UUID, status string) error {
	// Validate status
	if status != "going" && status != "interested" {
		return fmt.Errorf("invalid RSVP status: must be 'going' or 'interested'")
	}

	// Check if event exists in database
	_, err := s.repo.GetByID(ctx, eventID)
	if err != nil {
		// Event doesn't exist in DB - fetch and save from OpenAgenda
		log.Printf("Event %s not found in DB, fetching from OpenAgenda", eventID)

		if err := s.fetchAndSaveEventFromOpenAgenda(ctx, eventID); err != nil {
			return fmt.Errorf("failed to fetch and save event %s: %w", eventID, err)
		}
	}

	// Event exists (or was just created), create/update RSVP
	rsvp := &models.EventRSVP{
		EventID: eventID,
		UserID:  userID,
		Status:  status,
	}

	if err := s.repo.CreateOrUpdateRSVP(ctx, rsvp); err != nil {
		return fmt.Errorf("failed to create/update RSVP: %w", err)
	}

	return nil
}

// Updated helper function - much simpler now!
func (s *service) fetchAndSaveEventFromOpenAgenda(ctx context.Context, eventID uuid.UUID) error {
	// Use the new FetchEventByID method
	event, err := s.openAgendaAdapter.FetchEventByID(ctx, eventID)
	if err != nil {
		return fmt.Errorf("event not found in OpenAgenda: %w", err)
	}

	// Save the event to database
	if err := s.repo.Create(ctx, event); err != nil {
		return fmt.Errorf("failed to save event to database: %w", err)
	}

	log.Printf("Successfully saved OpenAgenda event %s to database", eventID)
	return nil
}

func (s *service) DeleteRSVP(ctx context.Context, eventID, userID uuid.UUID) error {
	if err := s.repo.DeleteRSVP(ctx, eventID, userID); err != nil {
		return fmt.Errorf("failed to delete RSVP: %w", err)
	}
	return nil
}

func (s *service) GetUserRSVP(ctx context.Context, eventID, userID uuid.UUID) (*models.EventRSVP, error) {
	rsvp, err := s.repo.GetUserRSVP(ctx, eventID, userID)
	if err != nil {
		return nil, err // Return nil if not found (not an error)
	}
	return rsvp, nil
}

func (s *service) GetUserRSVPs(ctx context.Context, userID uuid.UUID, status string) ([]*models.EventRSVP, error) {
	rsvps, err := s.repo.GetUserRSVPs(ctx, userID, status)
	if err != nil {
		return nil, fmt.Errorf("failed to get user RSVPs: %w", err)
	}
	return rsvps, nil
}
func (s *service) GetEventAttendees(ctx context.Context, eventID uuid.UUID) (*models.EventAttendeesResponse, error) {
	// Check if event exists
	_, err := s.repo.GetByID(ctx, eventID)
	if err != nil {
		return nil, fmt.Errorf("event not found: %w", err)
	}

	attendees, err := s.repo.GetEventAttendees(ctx, eventID)
	if err != nil {
		return nil, fmt.Errorf("failed to get attendees: %w", err)
	}

	return attendees, nil
}
