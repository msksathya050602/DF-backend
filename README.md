# Universal Backend Template

A production-ready Node.js/Express/TypeScript backend template with TypeORM, following clean architecture principles.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable server and database instances (singleton pattern)
│   ├── database.ts     # Database connection manager
│   ├── server.ts       # Express server setup and configuration
│   └── environment.ts  # Environment configuration manager
├── controllers/        # Business logic handlers
│   ├── baseController.ts      # Base controller with common methods
│   └── exampleController.ts   # Example controller
├── services/           # Database operations and external API integrations
│   ├── exampleService.ts       # Example service
│   └── external/               # External API integrations
│       └── exampleExternal.ts
├── routes/            # Route definitions
│   ├── v1_routes.ts   # Main route aggregator
│   └── example.ts     # Example route module
├── middlewares/       # Express middlewares
│   ├── authorization.ts   # JWT authentication middleware
│   ├── error.ts           # Global error handler
│   ├── log.ts             # Request logging middleware
│   └── setRoles.ts        # Role-based access control middleware
├── entities/          # TypeORM entities (database models)
│   └── Example.ts
├── helpers/           # Utility functions
│   ├── customErrors.ts    # Custom error classes
│   ├── getClientIp.ts     # IP address extraction
│   ├── healthCheck.ts     # Health check utilities
│   ├── logger.ts          # Winston logger setup
│   ├── retryWithBackoff.ts # Retry logic with exponential backoff
│   ├── status.ts          # Health status checker
│   └── toRoute.ts         # Route helper
├── migrations/        # Database migrations
├── types/             # TypeScript type definitions
│   ├── customRequest.ts   # Extended Express Request type
│   ├── customOpenapi.ts   # OpenAPI types
│   ├── routeoptions.ts    # Route configuration types
│   └── statusCodes.ts     # HTTP status codes enum
├── openapi/           # API documentation (Swagger/OpenAPI)
│   ├── components/    # OpenAPI components
│   ├── paths/         # API path definitions
│   └── tags/          # API tags
├── utils/             # Additional utility functions
├── config.ts          # Application configuration
├── dbConfig.ts        # Database configuration
└── index.ts           # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (or your preferred database)
- npm or yarn

### Installation

1. Copy this template to your project directory:

```bash
cp -r universal-backend-template your-project-name
cd your-project-name
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Update `src/config.ts`:
    - Change `APPLICATION_NAME` to your app name
    - Add your custom configuration

5. Configure database:
    - Update `src/dbConfig.ts` with your entities
    - Update database connection settings in `.env`

6. Run migrations:

```bash
npm run migration:run
```

7. Start development server:

```bash
npm run dev
```

## 📝 Key Features

### Architecture

- **Clean Architecture**: Separation of concerns with controllers, services, and entities
- **Singleton Pattern**: Database and server instances use singleton pattern
- **Type Safety**: Full TypeScript support with strict type checking
- **Path Aliases**: Clean imports using `@components`, `@controllers`, etc.

### Security

- **Helmet**: Security headers
- **CORS**: Configurable CORS settings
- **Rate Limiting**: Built-in rate limiting middleware
- **JWT Authentication**: Role-based access control
- **Input Validation**: Express-validator ready

### Database

- **TypeORM**: Object-relational mapping
- **Migrations**: Database migration support
- **Connection Pooling**: Efficient database connections
- **SSL Support**: Production-ready SSL configuration

### API Documentation

- **Swagger/OpenAPI**: Auto-generated API documentation
- **Interactive UI**: Swagger UI for testing endpoints

### Logging

- **Winston**: Structured logging
- **Request Logging**: Automatic request/response logging
- **Error Logging**: Comprehensive error tracking

### Health Checks

- **Health Endpoint**: `/healthcheck` for monitoring
- **Database Health**: Database connection status
- **Service Health**: External service status checks

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example`):

- `NODE_ENV`: Environment (local, testing, production)
- `PORT`: Server port
- `MASTER_DB_*`: Database connection settings
- `ACCESS_TOKEN_SECRET`: JWT access token secret
- `REFRESH_TOKEN_SECRET`: JWT refresh token secret

### Adding a New Route

1. Create a controller in `src/controllers/`:

```typescript
export class YourController extends BaseController {
    public static initialize(): YourController { ... }
    public yourMethod = async (req: CustomRequest, res: Response) => { ... }
}
```

2. Create a route file in `src/routes/`:

```typescript
export default (route: Router) => {
    const controller = YourController.initialize();
    const routeConfig: RouteOptions[] = [
        {
            method: 'get',
            path: '/your-endpoint',
            action: controller.yourMethod.bind(controller),
            description: 'Your endpoint description',
            roles: ['user', 'admin'], // Empty array for public routes
        },
    ];
    // ... register routes
    return route;
};
```

3. Register in `src/routes/v1_routes.ts`:

```typescript
import yourRoute from './yourRoute';
[yourRoute].forEach(callback => callback(route));
```

### Adding a New Entity

1. Create entity in `src/entities/`:

```typescript
@Entity('your_table')
export class YourEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
    // ... your columns
}
```

2. Register in `src/dbConfig.ts`:

```typescript
import { YourEntity } from '@/entities/YourEntity';
entities: [YourEntity, ...],
```

3. Generate migration:

```bash
npm run migration:generate -- --name=AddYourTable
```

### Adding External Service Integration

1. Create service in `src/services/external/`:

```typescript
export class YourExternalService {
    static async fetchData() {
        // Your integration logic
    }
}
```

2. Use in your service or controller:

```typescript
import { YourExternalService } from '@services/external/yourExternal';
```

## 📚 Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build TypeScript to JavaScript
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Fix ESLint errors
- `npm run format:check`: Check code formatting
- `npm run format:fix`: Fix code formatting
- `npm run migration:generate`: Generate new migration
- `npm run migration:run`: Run pending migrations
- `npm run migration:revert`: Revert last migration

## 🧪 Testing

Add your tests in `__tests__/` directory and configure Jest in `package.json`.

## 📖 API Documentation

Once the server is running, visit:

- Local: `http://localhost:3000/api/docs`
- Production: `http://your-domain.com/docs`

## 🔒 Security Best Practices

1. **Never commit `.env` files**
2. **Use strong JWT secrets**
3. **Enable SSL in production**
4. **Regularly update dependencies**
5. **Use rate limiting**
6. **Validate all inputs**
7. **Sanitize database queries**

## 📦 Deployment

### Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["node", "dist/index.js"]
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secrets
4. Enable SSL certificates
5. Configure reverse proxy (nginx)

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript strict mode
3. Add proper error handling
4. Write meaningful commit messages
5. Update documentation

## 📄 License

ISC

## 🆘 Support

For issues and questions, please refer to the documentation or create an issue.

---

**Happy Coding! 🚀**
