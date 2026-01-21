# Quick Start Guide

Get your backend up and running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js v18+ installed
- [ ] PostgreSQL (or your database) installed and running
- [ ] npm or yarn installed

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secrets
```

### 3. Update Config
Edit `src/config.ts`:
- Change `APPLICATION_NAME` to your app name

### 4. Set Up Database
```bash
# Create your database
createdb your_database_name

# Update src/dbConfig.ts with your entities
# Generate and run migrations
npm run migration:generate -- --name=InitialMigration
npm run migration:run
```

### 5. Start Server
```bash
npm run dev
```

### 6. Test It
```bash
# Health check
curl http://localhost:3000/healthcheck

# API docs
open http://localhost:3000/api/docs
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Building
npm run build            # Compile TypeScript

# Database
npm run migration:generate -- --name=MigrationName
npm run migration:run
npm run migration:revert

# Code Quality
npm run lint             # Check code
npm run lint:fix         # Fix code issues
npm run format:check     # Check formatting
npm run format:fix       # Fix formatting
```

## Project Structure Quick Reference

```
src/
├── components/     # Server & Database singletons
├── controllers/    # Request handlers
├── services/       # Business logic
├── routes/         # Route definitions
├── middlewares/    # Express middlewares
├── entities/       # Database models
├── helpers/        # Utilities
├── types/          # TypeScript types
└── migrations/     # Database migrations
```

## Next Steps

1. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the structure
3. Create your first entity, controller, and route
4. Start building your API!

## Need Help?

- Check [README.md](./README.md) for full documentation
- Review example files in the template
- Check the architecture documentation
