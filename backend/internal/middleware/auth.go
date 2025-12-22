package middleware

import (
	"github.com/Aolakije/City-Buzz/pkg/config"
	"github.com/Aolakije/City-Buzz/pkg/utils"
	"github.com/gofiber/fiber/v2"
)

// AuthMiddleware validates JWT token from httpOnly cookie
func AuthMiddleware(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {

		//  Allow CORS preflight requests
		if c.Method() == fiber.MethodOptions {
			return c.SendStatus(fiber.StatusOK)
		}

		// Get token from cookie
		token := c.Cookies("auth_token")
		if token == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false,
				"error":   "Unauthorized - no token provided",
			})
		}

		// Validate token
		claims, err := utils.ValidateJWT(token, cfg.JWT.Secret)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false,
				"error":   "Unauthorized - invalid token",
			})
		}

		// Set user info in context
		c.Locals("userID", claims.UserID.String())
		c.Locals("username", claims.Username)

		return c.Next()
	}
}
