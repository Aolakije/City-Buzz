package adapters

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/Aolakije/City-Buzz/internal/models"
	"github.com/Aolakije/City-Buzz/pkg/config"
	"github.com/google/uuid"
)

type OpenAgendaAdapter interface {
	FetchEvents(ctx context.Context, city, category string, limit int) ([]*models.Event, error)
	FetchEventByID(ctx context.Context, eventID uuid.UUID) (*models.Event, error)
}

type openAgendaAdapter struct {
	config *config.Config
	client *http.Client
}

func NewOpenAgendaAdapter(cfg *config.Config) OpenAgendaAdapter {
	return &openAgendaAdapter{
		config: cfg,
		client: &http.Client{Timeout: 30 * time.Second},
	}
}

func (a *openAgendaAdapter) FetchEventByID(ctx context.Context, eventID uuid.UUID) (*models.Event, error) {
	log.Printf("🔍 Fetching single event from OpenAgenda: %s", eventID)

	if a.config.OpenAgenda.AgendaUID == "" {
		return nil, fmt.Errorf("no AgendaUID configured")
	}

	// Fetch recent events and find the matching one
	events, err := a.FetchEvents(ctx, "", "", 300)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch events: %w", err)
	}

	// Find the matching event
	for _, event := range events {
		if event.ID == eventID {
			log.Printf("✅ Found event %s in OpenAgenda", eventID)
			return event, nil
		}
	}

	return nil, fmt.Errorf("event not found in OpenAgenda")
}

func (a *openAgendaAdapter) FetchEvents(ctx context.Context, city, category string, limit int) ([]*models.Event, error) {
	log.Printf("🔍 Fetching OpenAgenda events - Limit: %d, Category: %s", limit, category)

	if a.config.OpenAgenda.AgendaUID == "" {
		log.Println("No AgendaUID configured")
		return []*models.Event{}, nil
	}

	// Build API URL
	url := fmt.Sprintf("%s/agendas/%s/events", a.config.OpenAgenda.BaseURL, a.config.OpenAgenda.AgendaUID)

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Add query parameters
	q := req.URL.Query()
	q.Add("size", strconv.Itoa(limit))
	q.Add("sort", "timings.begin.asc")

	// CRITICAL: Only fetch current and upcoming events
	q.Add("relative[]", "current")
	q.Add("relative[]", "upcoming")

	// Add date filter to exclude past events
	now := time.Now()
	today := now.Format("2006-01-02")
	q.Add("timings[gte]", today) // Only events >= today

	if a.config.OpenAgenda.APIKey != "" {
		q.Add("key", a.config.OpenAgenda.APIKey)
	}

	req.URL.RawQuery = q.Encode()
	log.Printf("Calling: %s", req.URL.String())

	// Make request
	resp, err := a.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch from OpenAgenda: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		log.Printf("API Error (status %d): %s", resp.StatusCode, string(bodyBytes))
		return nil, fmt.Errorf("OpenAgenda API error (status %d)", resp.StatusCode)
	}

	// Parse response
	var apiResponse models.OpenAgendaResponse
	if err := json.Unmarshal(bodyBytes, &apiResponse); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	log.Printf("Received %d events from OpenAgenda", len(apiResponse.Events))

	// Convert events
	events := make([]*models.Event, 0, len(apiResponse.Events))

	for _, oaEvent := range apiResponse.Events {
		event, err := a.convertToEvent(oaEvent)
		if err != nil {
			log.Printf("Skipped event: %v", err)
			continue
		}

		// CRITICAL: Double-check that event is not in the past
		if event.StartDate.Before(time.Now().Add(-24 * time.Hour)) {
			log.Printf("⏭️  Skipping past event: %s (date: %s)", event.Title, event.StartDate)
			continue
		}

		// Apply category filter if specified
		if category != "" && event.Category != category {
			continue
		}

		events = append(events, event)
	}

	log.Printf("📊 Returning %d events after filtering (excluded past events)", len(events))
	return events, nil
}

func (a *openAgendaAdapter) convertToEvent(oaEvent models.OpenAgendaEvent) (*models.Event, error) {
	// Parse start date
	if oaEvent.FirstTiming.Begin == "" {
		return nil, fmt.Errorf("no start date")
	}

	startDate, err := time.Parse(time.RFC3339, oaEvent.FirstTiming.Begin)
	if err != nil {
		return nil, fmt.Errorf("invalid start date: %w", err)
	}

	// Parse end date
	var endDate *time.Time
	if oaEvent.LastTiming.End != "" && oaEvent.LastTiming.End != oaEvent.FirstTiming.Begin {
		parsed, err := time.Parse(time.RFC3339, oaEvent.LastTiming.End)
		if err == nil {
			endDate = &parsed
		}
	}

	// Get title (prefer French)
	title := oaEvent.Title.Fr
	if title == "" {
		title = oaEvent.Title.En
	}
	if title == "" {
		title = "Untitled Event"
	}

	// Get description (prefer French)
	description := oaEvent.Description.Fr
	if description == "" {
		description = oaEvent.Description.En
	}
	description = stripHTML(description)
	if len(description) > 5000 {
		description = description[:5000]
	}
	if description == "" {
		description = "No description available"
	}

	// Build image URL
	var imageURL *string
	if oaEvent.Image.Base != "" && oaEvent.Image.Filename != "" {
		fullImageURL := oaEvent.Image.Base + oaEvent.Image.Filename
		imageURL = &fullImageURL
	}

	// Location
	locationName := oaEvent.Location.Name
	if locationName == "" {
		locationName = oaEvent.Location.City
	}

	address := oaEvent.Location.Address
	city := oaEvent.Location.City
	if city == "" {
		city = "Unknown"
	}

	// Map category
	category := a.mapCategory(oaEvent)

	// Generate deterministic UUID based on external ID
	externalID := fmt.Sprintf("openagenda-%d", oaEvent.UID)
	eventID := uuid.NewSHA1(uuid.NameSpaceOID, []byte(externalID))

	// Build event
	event := &models.Event{
		ID:          eventID,
		Title:       title,
		Description: description,
		StartDate:   startDate,
		EndDate:     endDate,
		Location:    locationName,
		Address:     &address,
		City:        city,
		Category:    category,
		ImageURL:    imageURL,
		IsFree:      true,
		Source:      "openagenda",
		ExternalID:  &externalID,
	}

	return event, nil
}

func (a *openAgendaAdapter) mapCategory(oaEvent models.OpenAgendaEvent) string {
	title := strings.ToLower(oaEvent.Title.Fr + " " + oaEvent.Title.En)
	desc := strings.ToLower(oaEvent.Description.Fr + " " + oaEvent.Description.En)
	combined := title + " " + desc

	// Concerts & Music
	if strings.Contains(combined, "concert") ||
		strings.Contains(combined, "musique") ||
		strings.Contains(combined, "music") ||
		strings.Contains(combined, "spectacle") ||
		strings.Contains(combined, "scène") ||
		strings.Contains(combined, "live") {
		return "concerts"
	}

	// Festivals
	if strings.Contains(combined, "festival") {
		return "festivals"
	}

	// Sports
	if strings.Contains(combined, "sport") ||
		strings.Contains(combined, "match") ||
		strings.Contains(combined, "rugby") ||
		strings.Contains(combined, "football") ||
		strings.Contains(combined, "basket") ||
		strings.Contains(combined, "tournoi") {
		return "sports"
	}

	// Markets
	if strings.Contains(combined, "marché") ||
		strings.Contains(combined, "market") ||
		strings.Contains(combined, "brocante") ||
		strings.Contains(combined, "foire") {
		return "markets"
	}

	// Nightlife
	if strings.Contains(combined, "soirée") ||
		strings.Contains(combined, "night") ||
		strings.Contains(combined, "bar") ||
		strings.Contains(combined, "discothèque") ||
		strings.Contains(combined, "dj") ||
		strings.Contains(combined, "clubbing") {
		return "nightlife"
	}

	// Clubs & Dining
	if strings.Contains(combined, "club") ||
		strings.Contains(combined, "restaurant") ||
		strings.Contains(combined, "resto") ||
		strings.Contains(combined, "café") ||
		strings.Contains(combined, "dîner") ||
		strings.Contains(combined, "gastronomie") {
		return "clubs"
	}

	// Culture
	if strings.Contains(combined, "expo") ||
		strings.Contains(combined, "musée") ||
		strings.Contains(combined, "museum") ||
		strings.Contains(combined, "art") ||
		strings.Contains(combined, "galerie") ||
		strings.Contains(combined, "théâtre") ||
		strings.Contains(combined, "cinéma") ||
		strings.Contains(combined, "film") {
		return "culture"
	}

	return "culture"
}

func stripHTML(s string) string {
	s = strings.ReplaceAll(s, "<br>", "\n")
	s = strings.ReplaceAll(s, "<br/>", "\n")
	s = strings.ReplaceAll(s, "<br />", "\n")
	s = strings.ReplaceAll(s, "</p>", "\n\n")

	inTag := false
	result := strings.Builder{}
	for _, char := range s {
		if char == '<' {
			inTag = true
			continue
		}
		if char == '>' {
			inTag = false
			continue
		}
		if !inTag {
			result.WriteRune(char)
		}
	}

	cleaned := strings.TrimSpace(result.String())
	cleaned = strings.ReplaceAll(cleaned, "\n\n\n", "\n\n")
	return cleaned
}
