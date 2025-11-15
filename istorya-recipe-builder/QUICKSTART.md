# Quick Start Guide

Get the Istorya Recipe Builder running in 5 minutes!

## Prerequisites

- Node.js 14+ installed
- PostgreSQL 12+ installed and running
- Basic command line knowledge

## Installation

### 1. Install Dependencies

```bash
cd istorya-recipe-builder
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` and update the database password:
```env
DB_PASSWORD=your_postgres_password
```

### 3. Create Database

```bash
# macOS/Linux
createdb istorya_recipes

# Windows (in psql)
CREATE DATABASE istorya_recipes;
```

### 4. Initialize Database Schema

```bash
npm run init-db
```

You should see:
```
✓ Database schema created successfully!

Created tables:
  - recipes
  - analytics_events

Created views:
  - recipe_statistics
  - ingredient_popularity
  - method_vessel_combinations
```

### 5. Start the Server

```bash
npm run dev
```

You should see:
```
Istorya Recipe Builder server running on port 3000
Environment: development
Visit http://localhost:3000
```

### 6. Open in Browser

Navigate to: http://localhost:3000

You should see the Istorya Recipe Builder interface!

## Quick Test

### Create a Recipe

1. **Step 1**: Select constellation points (e.g., "Migration or displacement")
2. **Step 2**: Choose up to 3 ingredients
3. **Step 3**: Pick a method, vessel, and sawsawan
4. **Step 4**: View your recipe and click "Save Recipe"

### Check the Database

```bash
psql istorya_recipes

# List recipes
SELECT id, session_id, created_at FROM recipes;

# View statistics
SELECT * FROM ingredient_popularity;
```

## Using Docker (Alternative)

If you have Docker installed:

```bash
# Start everything
docker-compose up -d

# Initialize database
docker-compose exec app npm run init-db

# View logs
docker-compose logs -f

# Open http://localhost:3000
```

## Troubleshooting

### "Database connection failed"
- Make sure PostgreSQL is running: `pg_isready`
- Check your `.env` file has correct credentials
- Try: `psql -U postgres` to test connection

### "Port 3000 already in use"
- Change `PORT=3001` in `.env`
- Or kill the process: `lsof -ti:3000 | xargs kill`

### "npm install fails"
- Update Node.js: `node --version` should be 14+
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and try again

### "Schema creation fails"
- Make sure database exists: `psql -l | grep istorya`
- Check PostgreSQL version: `psql --version` (should be 12+)
- Try manually: `psql istorya_recipes < server/db/schema.sql`

## Next Steps

- Read [README.md](README.md) for full documentation
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Check [API documentation](#api-endpoints) in README

## API Testing

### Save a Recipe
```bash
curl -X POST http://localhost:3000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_123",
    "constellationSelections": [{"id": "migration", "label": "Migration"}],
    "ingredients": [{"id": "rice", "name": "Rice"}],
    "summary": "Test recipe"
  }'
```

### Get Statistics
```bash
curl http://localhost:3000/api/recipes/stats
```

### Health Check
```bash
curl http://localhost:3000/api/health
```

## Development Tips

### Auto-reload on changes
The `npm run dev` command uses nodemon for automatic reloading when you edit files.

### Database reset
```bash
# Reset and reinitialize
dropdb istorya_recipes
createdb istorya_recipes
npm run init-db
```

### View logs
```bash
# Development logs show in terminal
npm run dev

# Production logs
npm start 2>&1 | tee app.log
```

### Testing frontend only
If you just want to test the UI without the backend:
```bash
# Serve static files only
npx http-server public -p 8080

# Disable server features in public/config.js
FEATURES: {
  SAVE_TO_SERVER: false,
  ANALYTICS: false,
  LOCAL_STORAGE: true
}
```

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Initialize database
npm run init-db

# Docker commands
docker-compose up -d        # Start
docker-compose down         # Stop
docker-compose logs -f      # View logs
docker-compose ps           # Check status
```

## Support

If you're stuck:
1. Check the [Troubleshooting section](#troubleshooting)
2. Review the [README.md](README.md)
3. Open an issue on GitHub

Happy recipe building! 🍲
