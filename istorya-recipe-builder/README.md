# Istorya Recipe Builder

An interactive web application that helps users build their personal narrative ("Istorya") as a recipe, using Filipino cultural metaphors and culinary concepts.

## Features

- **Interactive Recipe Building**: Step-by-step process to create personalized narrative recipes
- **Constellation Points**: Select life patterns and experiences
- **Ingredients System**: Map experiences to symbolic Filipino ingredients
- **Method & Vessel Selection**: Choose processing approaches and contexts
- **Sawsawan (Agency Layer)**: Define personal adaptation strategies
- **Data Collection**: Backend API for saving and analyzing recipes
- **Analytics**: Track user interactions and recipe patterns
- **Accessibility**: WCAG-compliant with keyboard navigation and screen reader support
- **Session Persistence**: Auto-save drafts to localStorage
- **Responsive Design**: Works on all device sizes

## Tech Stack

### Frontend
- Vanilla JavaScript (ES6+)
- CSS3 with modern features
- Semantic HTML5
- LocalStorage for session persistence

### Backend
- Node.js
- Express.js
- PostgreSQL database
- RESTful API

### Security & Performance
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Compression middleware
- Input validation and sanitization

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   cd istorya-recipe-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development

   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=istorya_recipes
   DB_USER=postgres
   DB_PASSWORD=your_password_here

   ALLOWED_ORIGINS=http://localhost:3000
   ```

4. **Create PostgreSQL database**
   ```bash
   createdb istorya_recipes
   ```

5. **Initialize database schema**
   ```bash
   npm run init-db
   ```

6. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
istorya-recipe-builder/
├── public/                 # Frontend files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Stylesheet
│   ├── config.js          # Frontend configuration
│   ├── data.js            # Recipe data definitions
│   └── app.js             # Main application logic
├── server/                # Backend files
│   ├── index.js           # Express server
│   ├── db/
│   │   ├── database.js    # Database connection
│   │   └── schema.sql     # Database schema
│   ├── routes/
│   │   ├── recipes.js     # Recipe endpoints
│   │   └── analytics.js   # Analytics endpoints
│   └── scripts/
│       └── initDb.js      # DB initialization script
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### Recipes

#### Create/Update Recipe
```
POST /api/recipes
Content-Type: application/json

{
  "sessionId": "session_123",
  "constellationSelections": [...],
  "ingredients": [...],
  "method": {...},
  "vessel": {...},
  "sawsawan": {...},
  "summary": "..."
}
```

#### Get Recipe by Session
```
GET /api/recipes/session/:sessionId
```

#### Get Recipe Statistics
```
GET /api/recipes/stats
```

#### Get Recent Recipes
```
GET /api/recipes/recent?limit=10&offset=0
```

### Analytics

#### Track Event
```
POST /api/analytics/events
Content-Type: application/json

{
  "sessionId": "session_123",
  "eventType": "selection",
  "eventCategory": "ingredient",
  "eventAction": "select",
  "eventLabel": "rice",
  "eventValue": 1,
  "eventData": {...}
}
```

#### Get Analytics Summary
```
GET /api/analytics/summary?days=7
```

### Health Check
```
GET /api/health
```

## Database Schema

### Tables

#### `recipes`
- Stores completed recipe data
- Indexed by session_id, created_at
- JSONB columns for flexible data storage

#### `analytics_events`
- Tracks user interactions
- Supports event-based analytics
- Indexed for efficient querying

### Views

#### `recipe_statistics`
- Aggregated recipe data by day
- Constellation point frequencies

#### `ingredient_popularity`
- Ingredient usage statistics
- Percentage calculations

#### `method_vessel_combinations`
- Popular method/vessel pairings

## Configuration

### Frontend Configuration (`public/config.js`)

- `API_BASE_URL`: Backend API endpoint
- `FEATURES`: Feature flags (save to server, analytics, localStorage)
- `VALIDATION`: Validation rules
- `ANALYTICS`: Analytics integration settings

### Backend Configuration (`.env`)

- Server settings (port, environment)
- Database credentials
- CORS origins
- Rate limiting parameters

## Development

### Running in Development Mode
```bash
npm run dev
```

This uses nodemon for auto-reloading on file changes.

### Database Management

**Reset database:**
```bash
dropdb istorya_recipes
createdb istorya_recipes
npm run init-db
```

**Access PostgreSQL:**
```bash
psql istorya_recipes
```

## Deployment

### Production Checklist

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong database password
   - Configure proper CORS origins
   - Set appropriate rate limits

2. **Database**
   - Use managed PostgreSQL service (AWS RDS, Heroku Postgres, etc.)
   - Set up regular backups
   - Configure connection pooling

3. **Security**
   - Enable HTTPS
   - Set secure HTTP headers (already configured via Helmet)
   - Implement authentication for admin endpoints
   - Regular security updates

4. **Performance**
   - Enable compression (already configured)
   - Use CDN for static assets
   - Configure database indexes
   - Monitor query performance

5. **Monitoring**
   - Set up error logging (Sentry, LogRocket, etc.)
   - Monitor database performance
   - Track API response times
   - Set up uptime monitoring

### Deploy to Heroku (Example)

```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set ALLOWED_ORIGINS=https://your-app-name.herokuapp.com

# Deploy
git push heroku main

# Initialize database
heroku run npm run init-db

# Open app
heroku open
```

## Analytics & Data Collection

The application collects:
- Recipe selections (anonymous)
- Ingredient combinations
- Method/vessel pairings
- User interaction events
- Session information

**Privacy Notes:**
- No personally identifiable information (PII) is collected
- IP addresses are stored for rate limiting only
- Sessions are identified by random IDs
- All data is aggregated for statistics

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatible
- High contrast color scheme
- Reduced motion support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Acknowledgments

Built with Filipino cultural concepts and metaphors to help users explore and articulate their personal narratives through the lens of cooking and recipe-making.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
