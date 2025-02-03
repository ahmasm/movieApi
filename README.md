```markdown
# Movie Management API

A RESTful API for managing movies and directors using Node.js, MongoDB, and Redis caching.

## Architecture

### Clean Architecture
- **Core Layer**: Domain entities and business rules
- **Application Layer**: Use cases and DTOs
- **Infrastructure Layer**: Database, caching implementation
- **Presentation Layer**: Controllers and routes

### Key Technologies
- Node.js & TypeScript
- MongoDB with Mongoose
- Redis for caching
- Express.js
- Docker & Docker Compose
- Swagger for API documentation

## Features
- CRUD operations for movies and directors
- Redis caching for optimized read operations
- Swagger API documentation
- Docker containerization
- Unit and integration tests

## Getting Started

### Database Setup
Before running the application, you need to set up the database:

1. Create MongoDB database:
```bash
mongosh
use moviedb
```

2. Run database migrations to create collections and indexes:
```bash
npm run setup:db
```

### Running the Application

1. Clone the repository
```bash
git clone https://github.com/ahmasm/movieApi.git
```

2. Build and run with Docker Compose
```bash
docker-compose up --build -d     
```

Access:
- API: http://localhost:3000
- Swagger Documentation: http://localhost:3000/api-docs
- MongoDB: localhost:27017
- Redis: localhost:6380

### Environment Variables
```env
PORT=3000
MONGODB_URI=mongodb://movie-api-mongodb:27017/moviedb
REDIS_URL=redis://redis:6379
```

## API Endpoints

### Movies
- `GET /api/movies` - Get all movies
- `POST /api/movies` - Create movie
- `PUT /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie

### Directors
- `POST /api/directors` - Create director
- `DELETE /api/directors/:id` - Delete director

## Testing
```bash
npm run test
```

## Docker Services
- movie-api: Node.js application
- mongodb: MongoDB database
- redis: Redis cache

## Cache Strategy
- Read-through caching for GET operations
- Cache invalidation on write operations
- TTL: 1 hour
```