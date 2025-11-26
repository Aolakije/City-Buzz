# CityBuzz - Authentication System

## Sprint 1: Authentication MVP

This is the authentication system for the Rouen Social Platform, built with Go (Fiber), PostgreSQL, and Redis.

## Features

- User Registration with email or phone
- User Login with JWT (httpOnly cookies)
- Protected routes with JWT middleware
- Password hashing with bcrypt
- Input validation
- Secure cookie-based authentication

## Tech Stack

- **Backend**: Go 1.21 + Fiber v2
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Auth**: JWT (httpOnly cookies)

## Prerequisites

- Docker & Docker Compose
- Go 1.21+ (for local development)
- PostgreSQL 15+ (if running locally)
- Redis 7+ (if running locally)

## Quick Start with Docker

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd rouen-social
```

2. **Start all services**
```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend API on port 8080

3. **Run database migrations**
```bash
# Connect to postgres container
docker exec -it rouen_postgres psql -U postgres -d rouen_social

# Run the migration SQL
\i /path/to/migrations/001_create_users_table.up.sql
```

4. **Test the API**
```bash
curl http://localhost:8080/health
```

## Local Development (without Docker)

1. **Install dependencies**
```bash
cd backend
go mod download
```

2. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your local database credentials
```

3. **Start PostgreSQL and Redis**
```bash
# Using Homebrew (Mac)
brew services start postgresql@15
brew services start redis

# Or using Docker
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15
docker run -d -p 6379:6379 redis:7-alpine
```

4. **Run migrations**
```bash
psql -U postgres -d rouen_social -f migrations/001_create_users_table.up.sql
```

5. **Start the server**
```bash
go run cmd/api/main.go
```

## API Endpoints

### Health Check
```
GET /health
```

### Authentication

#### Register
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "gender": "male",
  "date_of_birth": "1995-05-15",
  "confirm_method": "email"
}
```

#### Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "identifier": "john@example.com",
  "password": "SecurePass123"
}
```

Sets httpOnly cookie `auth_token` with JWT.

#### Logout
```
POST /api/v1/auth/logout
```

Clears the `auth_token` cookie.

#### Get Current User
```
GET /api/v1/users/me
Cookie: auth_token=<jwt-token>
```

## Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

## Username Requirements

- 3-20 characters
- Letters, numbers, underscores, and hyphens only
- No spaces

## Age Requirement

- Must be at least 13 years old

## Security Features

- Passwords hashed with bcrypt (cost 12)
- JWT stored in httpOnly cookies (XSS protection)
- SameSite cookie flag (CSRF protection)
- Secure flag for HTTPS (production)
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)

## Project Structure

```
backend/
├── cmd/
│   └── api/
│       └── main.go              # Entry point
├── internal/
│   ├── auth/
│   │   ├── handler.go           # HTTP handlers
│   │   ├── service.go           # Business logic
│   │   └── repository.go        # Database operations
│   ├── middleware/
│   │   └── auth.go              # JWT validation
│   └── models/
│       └── user.go              # User models
├── pkg/
│   ├── database/
│   │   ├── postgres.go          # PostgreSQL connection
│   │   └── redis.go             # Redis connection
│   ├── utils/
│   │   ├── jwt.go               # JWT utilities
│   │   ├── password.go          # Password hashing
│   │   ├── validator.go         # Validation
│   │   └── response.go          # API responses
│   └── config/
│       └── config.go            # Configuration
├── migrations/
│   ├── 001_create_users_table.up.sql
│   └── 001_create_users_table.down.sql
├── go.mod
└── .env.example
```

## Environment Variables

See `.env.example` for all available environment variables.

## Testing

```bash
# Unit tests
go test ./...

# Integration tests
go test ./... -tags=integration

# Test coverage
go test -cover ./...
```

## Troubleshooting

### Database connection error
- Ensure PostgreSQL is running: `docker ps` or `brew services list`
- Check database credentials in `.env`
- Test connection: `psql -U postgres -h localhost`

### Redis connection error
- Ensure Redis is running: `redis-cli ping`
- Check Redis configuration in `.env`

### CORS errors
- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- Check browser console for specific CORS errors

## Next Steps

- Frontend integration (React)
- Email verification
- Password reset
- OAuth2 (Google, Facebook)
- Rate limiting
- User profile updates

## License

MIT