# Architecture Documentation

This document explains the architecture and design decisions of the universal backend template.

## Architecture Overview

The template follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Routes, Controllers, Middlewares)     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Business Logic Layer           │
│           (Services)                   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Data Access Layer               │
│    (Entities, Database, External APIs)  │
└─────────────────────────────────────────┘
```

## Core Components

### 1. Components (`src/components/`)

**Purpose**: Reusable singleton instances for server and database.

#### Server Component
- **File**: `server.ts`
- **Pattern**: Singleton
- **Responsibilities**:
  - Express app initialization
  - Middleware configuration
  - Route registration
  - OpenAPI/Swagger setup
  - Graceful shutdown handling

#### Database Component
- **File**: `database.ts`
- **Pattern**: Singleton
- **Responsibilities**:
  - TypeORM DataSource management
  - Connection lifecycle
  - Health checks
  - Entity manager access

#### Environment Component
- **File**: `environment.ts`
- **Pattern**: Singleton
- **Responsibilities**:
  - Environment variable loading
  - Environment validation

### 2. Controllers (`src/controllers/`)

**Purpose**: Handle HTTP requests and responses.

#### Base Controller
- **File**: `baseController.ts`
- **Provides**:
  - Standard HTTP response methods (ok, created, badRequest, etc.)
  - Error handling wrapper (`tryCall`)
  - Performance measurement utilities
  - Logger instance

#### Controller Pattern
- Extend `BaseController`
- Use singleton pattern for initialization
- Bind methods when registering routes
- Use `tryCall` for error handling

### 3. Services (`src/services/`)

**Purpose**: Business logic and data operations.

#### Service Pattern
- Static methods for stateless operations
- Access database through Database component
- Handle external API integrations
- Separate business logic from controllers

#### External Services (`src/services/external/`)
- Third-party API integrations
- Isolated from core business logic
- Easy to mock for testing

### 4. Routes (`src/routes/`)

**Purpose**: Route definitions and middleware composition.

#### Route Pattern
- Each feature has its own route file
- Routes return Express Router
- Use `toRoute` helper for consistent registration
- Middleware chain: `[setRoles, authorization, action]`

### 5. Middlewares (`src/middlewares/`)

**Purpose**: Request/response processing.

#### Available Middlewares

1. **authorization.ts**
   - JWT token verification
   - Role-based access control
   - Optional authentication for public routes

2. **error.ts**
   - Global error handler
   - Standardized error responses
   - Error logging

3. **log.ts**
   - Request logging
   - User tracking
   - IP address logging

4. **setRoles.ts**
   - Role assignment middleware
   - Works with authorization middleware

### 6. Entities (`src/entities/`)

**Purpose**: Database models using TypeORM.

#### Entity Pattern
- Extend `BaseEntity` for TypeORM methods
- Use decorators for column definitions
- Include timestamps (`createdAt`, `updatedAt`)

### 7. Helpers (`src/helpers/`)

**Purpose**: Reusable utility functions.

#### Key Helpers

- **logger.ts**: Winston logger configuration
- **customErrors.ts**: Custom error classes
- **retryWithBackoff.ts**: Retry logic with exponential backoff
- **healthCheck.ts**: Health check utilities
- **getClientIp.ts**: IP address extraction
- **toRoute.ts**: Route registration helper

### 8. Types (`src/types/`)

**Purpose**: TypeScript type definitions.

#### Key Types

- **customRequest.ts**: Extended Express Request with user info
- **routeoptions.ts**: Route configuration types
- **statusCodes.ts**: HTTP status code enum
- **customOpenapi.ts**: OpenAPI type definitions

## Design Patterns

### Singleton Pattern

Used for:
- Server instance
- Database connection
- Environment configuration

**Benefits**:
- Single instance ensures consistency
- Prevents multiple connections
- Centralized configuration

### Dependency Injection

Services and controllers receive dependencies through:
- Static initialization
- Constructor injection (where applicable)
- Component access through imports

### Middleware Chain

Request flow:
```
Request → setRoles → authorization → controller → service → database
```

### Error Handling

1. **Controller Level**: `tryCall` wrapper catches errors
2. **Middleware Level**: Authorization errors thrown
3. **Global Level**: `globalErrorHandler` formats responses

## Data Flow

### Read Operation Flow

```
1. HTTP Request
   ↓
2. Route matches → Middleware chain
   ↓
3. Controller method called
   ↓
4. Service method called
   ↓
5. Database query via Entity Manager
   ↓
6. Response returned through chain
```

### Write Operation Flow

```
1. HTTP Request with body
   ↓
2. Route matches → Middleware chain
   ↓
3. Controller validates input
   ↓
4. Service processes business logic
   ↓
5. Database transaction (if needed)
   ↓
6. Response with created/updated data
```

## Security Architecture

### Authentication Flow

```
1. User provides credentials
   ↓
2. Server validates credentials
   ↓
3. JWT tokens generated (access + refresh)
   ↓
4. Tokens sent to client
   ↓
5. Client includes token in requests
   ↓
6. Authorization middleware validates token
   ↓
7. Request proceeds if valid
```

### Authorization Flow

```
1. Request includes JWT token
   ↓
2. setRoles middleware sets required roles
   ↓
3. authorization middleware:
   - Extracts token
   - Verifies signature
   - Checks expiration
   - Validates roles
   ↓
4. Request proceeds if authorized
```

## Configuration Management

### Environment-Based Configuration

- **Local**: Development settings
- **Testing**: Test database and settings
- **Production**: Production database, SSL, etc.

### Configuration Files

1. **config.ts**: Application configuration
2. **dbConfig.ts**: Database configuration
3. **.env**: Environment variables

## Database Architecture

### TypeORM Features Used

- **Entities**: TypeScript classes with decorators
- **Migrations**: Version-controlled schema changes
- **Entity Manager**: Type-safe database operations
- **Connection Pooling**: Efficient connection management

### Migration Strategy

1. Generate migration from entity changes
2. Review generated SQL
3. Run migrations in order
4. Revert if needed

## API Documentation

### OpenAPI/Swagger Integration

- **Components**: Reusable schemas and security schemes
- **Paths**: Endpoint definitions
- **Tags**: Endpoint grouping

### Documentation Flow

```
Route Definition → OpenAPI Path → Swagger UI
```

## Logging Architecture

### Logger Configuration

- **Winston**: Structured logging
- **File Output**: Log files in production
- **Console Output**: Development
- **JSON Format**: Machine-readable logs

### Log Levels

- **info**: General information
- **warn**: Warnings
- **error**: Errors
- **debug**: Debug information

## Testing Strategy

### Unit Testing

- Test individual functions
- Mock external dependencies
- Test business logic in services

### Integration Testing

- Test API endpoints
- Test database operations
- Test middleware chains

### Test Structure

```
__tests__/
├── unit/
│   ├── services/
│   └── helpers/
├── integration/
│   ├── routes/
│   └── controllers/
└── e2e/
    └── api/
```

## Performance Considerations

### Optimization Strategies

1. **Database Indexing**: Add indexes for frequently queried columns
2. **Connection Pooling**: Reuse database connections
3. **Caching**: Implement caching for expensive operations
4. **Rate Limiting**: Prevent abuse
5. **Response Compression**: Reduce payload size

### Monitoring

- Health check endpoint
- Performance metrics
- Error tracking
- Database query monitoring

## Scalability

### Horizontal Scaling

- Stateless application design
- Shared database
- Load balancer compatible
- Session management via JWT

### Vertical Scaling

- Connection pooling
- Efficient query patterns
- Caching strategies
- Resource optimization

## Deployment Architecture

### Production Setup

```
Load Balancer
    ↓
Application Servers (Multiple Instances)
    ↓
Database (Primary + Replicas)
    ↓
External Services
```

### Containerization

- Docker support ready
- Environment-based configuration
- Health checks for orchestration

## Best Practices

1. **Separation of Concerns**: Keep layers independent
2. **Error Handling**: Always handle errors gracefully
3. **Validation**: Validate all inputs
4. **Security**: Never trust user input
5. **Logging**: Log important events
6. **Testing**: Write tests for critical paths
7. **Documentation**: Keep API docs updated
8. **Code Quality**: Follow TypeScript best practices

## Future Enhancements

Potential additions:
- GraphQL support
- WebSocket support
- Message queue integration
- Advanced caching
- API versioning
- Request validation middleware
- Rate limiting per user
- Audit logging
