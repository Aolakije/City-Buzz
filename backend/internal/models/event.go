package models

import (
	"time"

	"github.com/google/uuid"
)

// Event represents an event in the system
type Event struct {
	ID               uuid.UUID  `json:"id" db:"id"`
	Title            string     `json:"title" db:"title"`
	Description      string     `json:"description" db:"description"`
	StartDate        time.Time  `json:"start_date" db:"start_date"`
	EndDate          *time.Time `json:"end_date,omitempty" db:"end_date"`
	Location         string     `json:"location" db:"location"`
	Address          *string    `json:"address,omitempty" db:"address"`
	City             string     `json:"city" db:"city"`
	Category         string     `json:"category" db:"category"`
	EventType        *string    `json:"event_type,omitempty" db:"event_type"`
	ImageURL         *string    `json:"image_url,omitempty" db:"image_url"`
	Price            *string    `json:"price,omitempty" db:"price"`
	IsFree           bool       `json:"is_free" db:"is_free"`
	OrganizerName    *string    `json:"organizer_name,omitempty" db:"organizer_name"`
	OrganizerContact *string    `json:"organizer_contact,omitempty" db:"organizer_contact"`
	TicketURL        *string    `json:"ticket_url,omitempty" db:"ticket_url"`
	MaxCapacity      *int       `json:"max_capacity,omitempty" db:"max_capacity"`
	GoingCount       int        `json:"going_count" db:"going_count"`
	InterestedCount  int        `json:"interested_count" db:"interested_count"`
	Source           string     `json:"source" db:"source"`
	ExternalID       *string    `json:"external_id,omitempty" db:"external_id"`
	CreatedBy        *uuid.UUID `json:"created_by,omitempty" db:"created_by"`
	CreatedAt        time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time  `json:"updated_at" db:"updated_at"`
	IsDeleted        bool       `json:"is_deleted" db:"is_deleted"`
}

// EventRSVP represents a user's RSVP to an event
type EventRSVP struct {
	ID        uuid.UUID `json:"id" db:"id"`
	EventID   uuid.UUID `json:"event_id" db:"event_id"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	Status    string    `json:"status" db:"status"` // 'going' or 'interested'
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// CreateEventRequest represents the request to create a new event
type CreateEventRequest struct {
	Title            string     `json:"title" validate:"required,min=3,max=255"`
	Description      string     `json:"description" validate:"required,min=10,max=5000"`
	StartDate        time.Time  `json:"start_date" validate:"required"`
	EndDate          *time.Time `json:"end_date,omitempty"`
	Location         string     `json:"location" validate:"required"`
	Address          *string    `json:"address,omitempty"`
	City             string     `json:"city" validate:"required"`
	Category         string     `json:"category" validate:"required,oneof=concerts festivals sports culture markets nightlife clubs"`
	EventType        *string    `json:"event_type,omitempty" validate:"omitempty,oneof=party concert gaming hangout reading hiking travel show art sports dining coffee workshop networking movie outdoor"`
	ImageURL         *string    `json:"image_url,omitempty" validate:"omitempty,url"`
	Price            *string    `json:"price,omitempty"`
	IsFree           bool       `json:"is_free"`
	OrganizerName    *string    `json:"organizer_name,omitempty"`
	OrganizerContact *string    `json:"organizer_contact,omitempty"`
	TicketURL        *string    `json:"ticket_url,omitempty" validate:"omitempty,url"`
	MaxCapacity      *int       `json:"max_capacity,omitempty" validate:"omitempty,min=1"`
}

// UpdateEventRequest represents the request to update an event
type UpdateEventRequest struct {
	Title            *string    `json:"title,omitempty" validate:"omitempty,min=3,max=255"`
	Description      *string    `json:"description,omitempty" validate:"omitempty,min=10,max=5000"`
	StartDate        *time.Time `json:"start_date,omitempty"`
	EndDate          *time.Time `json:"end_date,omitempty"`
	Location         *string    `json:"location,omitempty"`
	Address          *string    `json:"address,omitempty"`
	City             *string    `json:"city,omitempty"`
	Category         *string    `json:"category,omitempty" validate:"omitempty,oneof=concerts festivals sports culture markets nightlife clubs"`
	EventType        *string    `json:"event_type,omitempty" validate:"omitempty,oneof=party concert gaming hangout reading hiking travel show art sports dining coffee workshop networking movie outdoor"`
	ImageURL         *string    `json:"image_url,omitempty" validate:"omitempty,url"`
	Price            *string    `json:"price,omitempty"`
	IsFree           *bool      `json:"is_free,omitempty"`
	OrganizerName    *string    `json:"organizer_name,omitempty"`
	OrganizerContact *string    `json:"organizer_contact,omitempty"`
	TicketURL        *string    `json:"ticket_url,omitempty" validate:"omitempty,url"`
	MaxCapacity      *int       `json:"max_capacity,omitempty" validate:"omitempty,min=1"`
}

// RSVPRequest represents the request to RSVP to an event
type RSVPRequest struct {
	Status string `json:"status" validate:"required,oneof=going interested"`
}

// OpenAgendaEvent represents an event from OpenAgenda API
type OpenAgendaEvent struct {
	UID   int64  `json:"uid"`
	Slug  string `json:"slug"`
	Title struct {
		Fr string `json:"fr"`
		En string `json:"en"`
	} `json:"title"`
	Description struct {
		Fr string `json:"fr"`
		En string `json:"en"`
	} `json:"description"`
	Image struct {
		Base     string `json:"base"`
		Filename string `json:"filename"`
		Variants []struct {
			Filename string `json:"filename"`
			Type     string `json:"type"`
		} `json:"variants"`
	} `json:"image"`
	Location struct {
		Name      string  `json:"name"`
		Address   string  `json:"address"`
		City      string  `json:"city"`
		Latitude  float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
	} `json:"location"`
	DateRange struct {
		Fr string `json:"fr"`
		En string `json:"en"`
	} `json:"dateRange"`
	FirstTiming struct {
		Begin string `json:"begin"`
		End   string `json:"end"`
	} `json:"firstTiming"`
	LastTiming struct {
		Begin string `json:"begin"`
		End   string `json:"end"`
	} `json:"lastTiming"`
	NextTiming *struct {
		Begin string `json:"begin"`
		End   string `json:"end"`
	} `json:"nextTiming"`
}

// OpenAgendaResponse represents the response from OpenAgenda API
type OpenAgendaResponse struct {
	Events []OpenAgendaEvent `json:"events"`
	Total  int               `json:"total"`
}

// EventsResponse represents the structured response with current and upcoming events
type EventsResponse struct {
	Current  []*Event `json:"current"`
	Upcoming []*Event `json:"upcoming"`
	Trending []*Event `json:"trending,omitempty"`
	Total    int      `json:"total"`
}

// EventAttendee represents a user who RSVP'd to an event
type EventAttendee struct {
	UserID    uuid.UUID `json:"user_id"`
	Username  string    `json:"username"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	AvatarURL *string   `json:"avatar_url,omitempty"`
	Status    string    `json:"status"` // 'going' or 'interested'
	RSVPedAt  time.Time `json:"rsvped_at"`
}

// EventAttendeesResponse represents the list of attendees
type EventAttendeesResponse struct {
	Going           []*EventAttendee `json:"going"`
	Interested      []*EventAttendee `json:"interested"`
	GoingCount      int              `json:"going_count"`
	InterestedCount int              `json:"interested_count"`
}
