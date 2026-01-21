# Setup Guide

This guide will help you set up a new backend project using this universal template.

## Step-by-Step Setup

### 1. Copy the Template

```bash
# Copy the template to your new project directory
cp -r universal-backend-template your-project-name
cd your-project-name
```

### 2. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit from universal backend template"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values
nano .env  # or use your preferred editor
```

**Required Environment Variables:**
- `NODE_ENV`: Set to `local` for development
- `PORT`: Your server port (default: 3000)
- `MASTER_DB_HOST`: Database host
- `MASTER_DB_PORT`: Database port (default: 5432 for PostgreSQL)
- `MASTER_DB_DATABASE`: Database name
- `MASTER_DB_USER`: Database username
- `MASTER_DB_PASSWORD`: Database password
- `ACCESS_TOKEN_SECRET`: JWT access token secret (generate a strong random string)
- `REFRESH_TOKEN_SECRET`: JWT refresh token secret (generate a strong random string)

**Generate JWT Secrets:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. Update Application Configuration

Edit `src/config.ts`:
- Change `APPLICATION_NAME` to your application name
- Add any custom configuration you need

### 6. Set Up Database

#### Option A: Using PostgreSQL (Recommended)

1. Install PostgreSQL if not already installed
2. Create a database:
```sql
CREATE DATABASE your_database_name;
```

3. Update `src/dbConfig.ts`:
   - Import your entities
   - Add them to the `entities` array

#### Option B: Using Another Database

1. Update `src/dbConfig.ts` to use your database type
2. Install the appropriate TypeORM driver:
```bash
npm install mysql2  # For MySQL
npm install sqlite3 # For SQLite
# etc.
```

### 7. Create Your First Entity

1. Create an entity file in `src/entities/`:
```typescript
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('your_table_name')
export class YourEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
```

2. Register it in `src/dbConfig.ts`:
```typescript
import { YourEntity } from '@/entities/YourEntity';
entities: [YourEntity],
```

### 8. Generate and Run Migrations

```bash
# Generate a migration
npm run migration:generate -- --name=InitialMigration

# Review the generated migration file in src/migrations/

# Run migrations
npm run migration:run
```

### 9. Create Your First Controller

1. Create `src/controllers/yourController.ts`:
```typescript
import { BaseController } from './baseController';
import { CustomRequest } from '@customTypes/customRequest';
import { Response } from 'express';
import { YourService } from '@services/yourService';

export class YourController extends BaseController {
    private static instance: YourController;

    private constructor() {
        super();
    }

    public static initialize(): YourController {
        if (!YourController.instance) {
            YourController.instance = new YourController();
        }
        return YourController.instance;
    }

    public getData = async (req: CustomRequest, res: Response): Promise<void> => {
        await this.tryCall(async () => {
            const result = await YourService.getData();
            this.ok(res, { data: result });
        });
    };
}
```

### 10. Create Your First Service

1. Create `src/services/yourService.ts`:
```typescript
import { Database } from '@components/database';
import { dbSource } from '@/dbConfig';
import { YourEntity } from '@/entities/YourEntity';

export class YourService {
    private static db = Database.initialize(dbSource);

    static async getData() {
        const entityManager = YourService.db.getEntityManager();
        return await entityManager.find(YourEntity);
    }
}
```

### 11. Create Your First Route

1. Create `src/routes/yourRoute.ts`:
```typescript
import { YourController } from '@controllers/yourController';
import { RouteOptions } from '@customTypes/routeoptions';
import { toRoute } from '@helpers/toRoute';
import { authorization } from '@middlewares/authorization';
import { setRoles } from '@middlewares/setRoles';
import { Router } from 'express';

export default (route: Router) => {
    const controller = YourController.initialize();
    const getData = controller.getData.bind(controller);

    const routeConfig: RouteOptions[] = [
        {
            method: 'get',
            path: '/your-endpoint',
            action: getData,
            description: 'Get your data',
            roles: [], // Empty array = public route
        },
    ];

    routeConfig.forEach(config => {
        toRoute(route, config, [setRoles(config.roles), authorization, config.action]);
    });

    return route;
};
```

2. Register in `src/routes/v1_routes.ts`:
```typescript
import yourRoute from './yourRoute';

[yourRoute].forEach(callback => callback(route));
```

### 12. Test Your Setup

1. Start the development server:
```bash
npm run dev
```

2. Test the health endpoint:
```bash
curl http://localhost:3000/healthcheck
```

3. Test your endpoint:
```bash
curl http://localhost:3000/api/v1/your-endpoint
```

4. View API documentation:
   - Open browser: `http://localhost:3000/api/docs`

### 13. Clean Up Example Files (Optional)

Once you've verified everything works, you can remove example files:
- `src/controllers/exampleController.ts`
- `src/routes/example.ts`
- `src/services/exampleService.ts`
- `src/services/external/exampleExternal.ts`
- `src/entities/Example.ts`

## Common Customizations

### Adding Authentication

1. Create a user entity
2. Create authentication controller/service
3. Add login/register routes
4. Use JWT middleware for protected routes

### Adding External API Integration

1. Create service in `src/services/external/`
2. Add API keys to `.env`
3. Use the service in your controllers

### Adding File Upload

1. Install multer: `npm install multer @types/multer`
2. Create upload middleware
3. Add to route configuration

### Adding Email Service

1. Install email library (e.g., nodemailer)
2. Create email service
3. Configure SMTP settings in `.env`

## Troubleshooting

### Database Connection Issues

- Verify database credentials in `.env`
- Check if database is running
- Verify network connectivity
- Check SSL configuration for production

### Port Already in Use

- Change `PORT` in `.env`
- Or kill the process using the port:
```bash
lsof -ti:3000 | xargs kill
```

### Migration Errors

- Check database connection
- Verify entity definitions
- Review migration files for syntax errors
- Ensure database user has proper permissions

### TypeScript Errors

- Run `npm run build` to check for type errors
- Ensure all imports use path aliases correctly
- Check `tsconfig.json` configuration

## Next Steps

1. Set up CI/CD pipeline
2. Configure production environment
3. Add unit and integration tests
4. Set up monitoring and logging
5. Configure error tracking (e.g., Sentry)

## Support

For issues or questions, refer to the main README.md or create an issue in your repository.
