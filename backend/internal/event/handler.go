package event

import (
	"log"
	"strconv"
	"strings"

	"github.com/Aolakije/City-Buzz/internal/models"
	"github.com/Aolakije/City-Buzz/pkg/utils"
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

// Replace your GetRouenEvents handler in internal/event/handler.go:

func (h *Handler) GetRouenEvents(c *fiber.Ctx) error {
	category := c.Query("category", "")
	language := c.Query("language", "fr")
	page, _ := strconv.Atoi(c.Query("page", "1"))
	pageSize, _ := strconv.Atoi(c.Query("pageSize", "100")) // Default 100

	// Use the new structured method
	result, err := h.service.GetEventsStructured(c.Context(), "Rouen", category, language, page, pageSize)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch Rouen events")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "Rouen events fetched successfully", fiber.Map{
		"current":  result.Current,
		"upcoming": result.Upcoming,
		"total":    result.Total,
		"location": "Rouen",
		"category": category,
	})
}

// Update GetTrendingEvents to default to 10 events
func (h *Handler) GetTrendingEvents(c *fiber.Ctx) error {
	city := c.Query("city", "Rouen")
	limit, _ := strconv.Atoi(c.Query("limit", "10")) // Increased default to 10

	events, err := h.service.GetTrendingEvents(c.Context(), city, limit)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch trending events")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "Trending events fetched successfully", fiber.Map{
		"events": events,
		"total":  len(events),
	})
}

// GetEventByID handles GET /api/v1/events/:id
func (h *Handler) GetEventByID(c *fiber.Ctx) error {
	eventID, err := utils.ParseUUID(c.Params("id"))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid event ID")
	}

	event, err := h.service.GetEvent(c.Context(), eventID)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusNotFound, "Event not found")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "Event fetched successfully", event)
}

// CreateEvent handles POST /api/v1/events (protected)
func (h *Handler) CreateEvent(c *fiber.Ctx) error {
	userIDValue := c.Locals("userID")
	if userIDValue == nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	userID, err := utils.ParseUUID(userIDValue.(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	var req models.CreateEventRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if req.TicketURL != nil && strings.TrimSpace(*req.TicketURL) == "" {
		req.TicketURL = nil
	}

	if err := utils.ValidateStruct(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	event, err := h.service.CreateEvent(c.Context(), &req, userID)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to create event")
	}

	return utils.SuccessResponse(c, fiber.StatusCreated, "Event created successfully", event)
}

// UpdateEvent handles PUT /api/v1/events/:id (protected)
func (h *Handler) UpdateEvent(c *fiber.Ctx) error {
	userIDValue := c.Locals("userID")
	if userIDValue == nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	userID, err := utils.ParseUUID(userIDValue.(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	eventID, err := utils.ParseUUID(c.Params("id"))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid event ID")
	}

	var req models.UpdateEventRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if err := utils.ValidateStruct(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}

	event, err := h.service.UpdateEvent(c.Context(), eventID, &req, userID)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "Event updated successfully", event)
}

// DeleteEvent handles DELETE /api/v1/events/:id (protected)
func (h *Handler) DeleteEvent(c *fiber.Ctx) error {
	userIDValue := c.Locals("userID")
	if userIDValue == nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	userID, err := utils.ParseUUID(userIDValue.(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	eventID, err := utils.ParseUUID(c.Params("id"))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid event ID")
	}

	if err := h.service.DeleteEvent(c.Context(), eventID, userID); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "Event deleted successfully", nil)
}

// GetUserEvents handles GET /api/v1/events/my-events (protected)
func (h *Handler) GetUserEvents(c *fiber.Ctx) error {
	userIDValue := c.Locals("userID")
	if userIDValue == nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	userID, err := utils.ParseUUID(userIDValue.(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	events, err := h.service.GetUserEvents(c.Context(), userID)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch user events")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "User events fetched successfully", events)
}

// CreateOrUpdateRSVP handles POST /api/v1/events/:id/rsvp (protected)
// Replace your CreateOrUpdateRSVP in internal/event/handler.go with this:
func (h *Handler) CreateOrUpdateRSVP(c *fiber.Ctx) error {
	log.Printf("📝 RSVP Request received")

	// Get user ID
	userIDValue := c.Locals("userID")
	if userIDValue == nil {
		log.Printf("❌ User not authenticated - userID is nil")
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}
	log.Printf("userIDValue type: %T, value: %v", userIDValue, userIDValue)

	userID, err := utils.ParseUUID(userIDValue.(string))
	if err != nil {
		log.Printf("❌ Failed to parse userID: %v", err)
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}
	log.Printf("✅ User ID parsed: %s", userID)

	// Get event ID
	eventIDParam := c.Params("id")
	log.Printf("Event ID from params: %s", eventIDParam)

	eventID, err := utils.ParseUUID(eventIDParam)
	if err != nil {
		log.Printf("❌ Failed to parse eventID: %v", err)
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid event ID")
	}
	log.Printf("✅ Event ID parsed: %s", eventID)

	// Parse request body
	var req models.RSVPRequest
	bodyBytes := c.Body()
	log.Printf("Request body: %s", string(bodyBytes))

	if err := c.BodyParser(&req); err != nil {
		log.Printf("❌ Failed to parse body: %v", err)
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body")
	}
	log.Printf("✅ Request parsed - Status: %s", req.Status)

	// Validate
	if err := utils.ValidateStruct(&req); err != nil {
		log.Printf("❌ Validation failed: %v", err)
		return utils.ErrorResponse(c, fiber.StatusBadRequest, err.Error())
	}
	log.Printf("✅ Validation passed")

	// Call service
	log.Printf("🔄 Calling service.CreateOrUpdateRSVP(eventID=%s, userID=%s, status=%s)", eventID, userID, req.Status)
	if err := h.service.CreateOrUpdateRSVP(c.Context(), eventID, userID, req.Status); err != nil {
		log.Printf("❌ Service error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to update RSVP: "+err.Error())
	}

	log.Printf("✅ RSVP created/updated successfully")
	return utils.SuccessResponse(c, fiber.StatusOK, "RSVP updated successfully", fiber.Map{
		"event_id": eventID,
		"status":   req.Status,
	})
}

// DeleteRSVP handles DELETE /api/v1/events/:id/rsvp (protected)
func (h *Handler) DeleteRSVP(c *fiber.Ctx) error {
	userIDValue := c.Locals("userID")
	if userIDValue == nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	userID, err := utils.ParseUUID(userIDValue.(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	eventID, err := utils.ParseUUID(c.Params("id"))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid event ID")
	}

	if err := h.service.DeleteRSVP(c.Context(), eventID, userID); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to delete RSVP")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "RSVP removed successfully", nil)
}

// GetUserRSVP handles GET /api/v1/events/:id/rsvp (protected)
func (h *Handler) GetUserRSVP(c *fiber.Ctx) error {
	userIDValue := c.Locals("userID")
	if userIDValue == nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	userID, err := utils.ParseUUID(userIDValue.(string))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	eventID, err := utils.ParseUUID(c.Params("id"))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid event ID")
	}

	rsvp, err := h.service.GetUserRSVP(c.Context(), eventID, userID)
	if err != nil {
		// User hasn't RSVP'd - return null
		return utils.SuccessResponse(c, fiber.StatusOK, "No RSVP found", nil)
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "RSVP fetched successfully", rsvp)
}

// GetUserRSVPs handles GET /api/v1/events/my-rsvps (protected)
func (h *Handler) GetUserRSVPs(c *fiber.Ctx) error {
	// Check if userID exists in context
	userIDValue := c.Locals("userID")
	if userIDValue == nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	// Convert to string and parse UUID
	userIDStr, ok := userIDValue.(string)
	if !ok {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "Invalid user ID format")
	}

	userID, err := utils.ParseUUID(userIDStr)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	status := c.Query("status", "") // 'going', 'interested', or '' for all

	rsvps, err := h.service.GetUserRSVPs(c.Context(), userID, status)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch RSVPs")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "RSVPs fetched successfully", rsvps)
}

// GetEventAttendees handles GET /api/v1/events/:id/attendees
func (h *Handler) GetEventAttendees(c *fiber.Ctx) error {
	eventID, err := utils.ParseUUID(c.Params("id"))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid event ID")
	}

	attendees, err := h.service.GetEventAttendees(c.Context(), eventID)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch attendees")
	}

	return utils.SuccessResponse(c, fiber.StatusOK, "Attendees fetched successfully", attendees)
}
