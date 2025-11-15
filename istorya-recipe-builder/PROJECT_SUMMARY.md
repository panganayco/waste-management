# Istorya Recipe Builder - Project Summary

## Overview

The Istorya Recipe Builder is a production-ready web application that transforms personal narratives into Filipino-inspired recipe metaphors. This project provides an interactive platform for users to explore and articulate their stories through the cultural lens of Filipino cooking.

## Key Features

### 1. **Interactive Recipe Building** (4-Step Process)
   - **Step 1**: Constellation Point Selection - Users identify life patterns
   - **Step 2**: Ingredient Selection - Mapped from constellation points
   - **Step 3**: Method, Vessel & Sawsawan - Processing and context selection
   - **Step 4**: Recipe Card Generation - Personalized summary and output

### 2. **Data Collection & Analytics**
   - PostgreSQL database for recipe storage
   - Analytics event tracking
   - Statistical views for insights
   - Privacy-conscious design (no PII collection)

### 3. **Accessibility & Inclusivity**
   - WCAG 2.1 Level AA compliant
   - Full keyboard navigation
   - Screen reader support
   - ARIA labels and semantic HTML
   - Reduced motion support
   - High contrast compatible

### 4. **Session Management**
   - LocalStorage for draft persistence
   - Unique session IDs
   - Auto-save functionality
   - Export options (text and JSON)

### 5. **Production Features**
   - Rate limiting
   - CORS configuration
   - Security headers (Helmet.js)
   - Input validation
   - Error handling
   - Health check endpoint
   - Compression middleware

## Technical Architecture

### Frontend Stack
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with custom properties, flexbox, grid
- **Vanilla JavaScript**: ES6+ with modular architecture
- **No frameworks**: Minimal dependencies, maximum performance

### Backend Stack
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **PostgreSQL**: Primary database
- **Middleware**: Helmet, CORS, Compression, Morgan, Rate-limit

### Database Design
- **Tables**: `recipes`, `analytics_events`
- **Views**: `recipe_statistics`, `ingredient_popularity`, `method_vessel_combinations`
- **JSONB Columns**: Flexible recipe data storage
- **Indexes**: Optimized for common queries

## File Structure

```
istorya-recipe-builder/
├── public/                      # Frontend (Static Files)
│   ├── index.html              # Main HTML with accessibility
│   ├── styles.css              # Comprehensive styling
│   ├── config.js               # Frontend configuration
│   ├── data.js                 # Recipe data definitions
│   └── app.js                  # Application logic (OOP)
│
├── server/                      # Backend
│   ├── index.js                # Express server setup
│   ├── db/
│   │   ├── database.js         # PostgreSQL connection pool
│   │   └── schema.sql          # Database schema
│   ├── routes/
│   │   ├── recipes.js          # Recipe CRUD endpoints
│   │   └── analytics.js        # Analytics endpoints
│   └── scripts/
│       └── initDb.js           # Database initialization
│
├── docs/                        # Documentation
│   ├── README.md               # Main documentation
│   ├── QUICKSTART.md           # 5-minute setup guide
│   ├── DEPLOYMENT.md           # Platform-specific deployment
│   ├── CHANGELOG.md            # Version history
│   ├── CONTRIBUTING.md         # Contribution guidelines
│   └── PROJECT_SUMMARY.md      # This file
│
├── config/                      # Configuration
│   ├── .env.example            # Environment template
│   ├── .nvmrc                  # Node version
│   └── Procfile                # Heroku deployment
│
├── docker/                      # Docker configuration
│   ├── Dockerfile              # Container image
│   ├── docker-compose.yml      # Multi-container setup
│   └── .dockerignore           # Docker ignore rules
│
└── package.json                 # Dependencies and scripts
```

## API Endpoints

### Recipe Management
- `POST /api/recipes` - Create/update recipe
- `GET /api/recipes/session/:sessionId` - Get recipe by session
- `GET /api/recipes/stats` - Get recipe statistics
- `GET /api/recipes/recent` - Get recent recipes

### Analytics
- `POST /api/analytics/events` - Track analytics event
- `GET /api/analytics/summary` - Get analytics summary

### System
- `GET /api/health` - Health check endpoint

## Data Model

### Recipe Object
```javascript
{
  sessionId: "session_xxx",
  timestamp: "2025-01-15T...",
  constellationSelections: [
    { id: "migration", label: "Migration or displacement", ... }
  ],
  ingredients: [
    { id: "rice", emoji: "🌾", name: "Rice", meaning: "pressure + expectation" }
  ],
  method: { id: "simmered", emoji: "🍲", label: "Simmered", ... },
  vessel: { id: "palayok", emoji: "🏺", label: "Palayok", ... },
  sawsawan: { id: "matubig", emoji: "🌊", label: "Matubig (flowing)", ... },
  summary: "Personalized narrative summary..."
}
```

## Cultural Concepts

### Filipino Metaphors Used

1. **Ingredients** (Base experiences)
   - Rice: Pressure + expectation
   - Vinegar: Clarity + disruption
   - Fish Sauce: Depth + isolation
   - Coconut: Adaptation + code-switch
   - Calamansi: Both/and identity
   - Sili: Awakening + anger
   - Salt: Essential truth + community

2. **Methods** (Processing approaches)
   - Simmered: Slow integration
   - Charred: Intense transformation
   - Raw/Kinilaw: Wound + acid truth
   - Fermented: Time + pressure
   - Sliced: Boundaries/separation
   - Stirred/Halo-halo: Mixed identity

3. **Vessels** (Contexts)
   - Palayok: Ancestral, slow, communal
   - Kawali: High heat, fast, alone
   - Kaldero: Family-sized capacity
   - Bilao: Visible, shared, witnessed

4. **Sawsawan** (Agency/Adaptation)
   - Matubig: Flowing, adjusting
   - Durog: Grinding, rebuilding
   - Pinreserba: Fermenting, transforming
   - Sariwa: Fresh, present
   - Mamantika: Protective
   - May Kapares: Paired, supported
   - Pinaghalo: Mixed approaches

## Deployment Options

### Supported Platforms
1. **Heroku** - Quick deployment with Heroku Postgres
2. **AWS** - Elastic Beanstalk + RDS
3. **DigitalOcean** - App Platform or Droplets
4. **Docker** - Containerized deployment
5. **Any Node.js host** - Generic deployment

### Quick Deploy Commands

**Heroku:**
```bash
heroku create
heroku addons:create heroku-postgresql
git push heroku main
heroku run npm run init-db
```

**Docker:**
```bash
docker-compose up -d
docker-compose exec app npm run init-db
```

## Security Features

1. **Helmet.js** - Security headers
2. **CORS** - Origin restrictions
3. **Rate Limiting** - DDoS protection
4. **Input Validation** - Prevent injection
5. **SQL Parameterization** - Prevent SQL injection
6. **Environment Variables** - Secure configuration
7. **HTTPS Ready** - SSL/TLS support

## Performance Optimizations

1. **Compression** - Gzip compression enabled
2. **Connection Pooling** - PostgreSQL pool management
3. **Indexes** - Database query optimization
4. **Minimal Dependencies** - Reduced bundle size
5. **Static File Serving** - Efficient asset delivery
6. **LocalStorage Caching** - Client-side persistence

## Analytics & Insights

### Tracked Metrics
- Recipe creation count
- Ingredient popularity
- Method/vessel combinations
- Constellation point frequencies
- User interaction events
- Session statistics

### Privacy Considerations
- No personally identifiable information (PII)
- IP addresses for rate limiting only
- Anonymous session IDs
- Aggregate statistics only
- GDPR-friendly design

## Testing Strategy

### Manual Testing Coverage
- Cross-browser compatibility
- Responsive design
- Keyboard navigation
- Screen reader compatibility
- API endpoint functionality
- Database operations

### Future Automated Testing
- Unit tests for business logic
- Integration tests for API
- End-to-end tests for UI
- Database migration tests
- Performance benchmarks

## Documentation Suite

1. **README.md** - Comprehensive setup and usage
2. **QUICKSTART.md** - 5-minute getting started
3. **DEPLOYMENT.md** - Platform-specific deployment
4. **CONTRIBUTING.md** - Developer contribution guide
5. **CHANGELOG.md** - Version history
6. **PROJECT_SUMMARY.md** - This overview
7. **Inline Comments** - Code-level documentation

## Future Enhancements

### Planned Features
- User authentication
- Recipe sharing via URLs
- Public recipe gallery
- PDF export
- Multi-language support (Tagalog, Spanish)
- Mobile app version
- Recipe versioning
- Social media integration
- Advanced analytics dashboard
- Recipe recommendations
- Community features

### Technical Improvements
- Automated testing suite
- CI/CD pipeline
- Performance monitoring
- Error tracking (Sentry)
- CDN integration
- Caching layer (Redis)
- Search functionality
- Data visualization

## Success Metrics

### Technical Success
- ✅ Production-ready codebase
- ✅ Secure and performant
- ✅ Fully documented
- ✅ Multiple deployment options
- ✅ Accessibility compliant
- ✅ Database optimized

### User Experience Success
- ✅ Intuitive 4-step process
- ✅ Cultural authenticity
- ✅ Accessible to all users
- ✅ Mobile-responsive
- ✅ Fast and reliable
- ✅ Privacy-respecting

## License

MIT License - Open source and free to use

## Credits

### Technologies
- Node.js & Express.js
- PostgreSQL
- Vanilla JavaScript
- Modern CSS3

### Cultural Concepts
- Filipino culinary traditions
- Narrative therapy frameworks
- Cultural metaphor systems

## Getting Started

For developers:
```bash
git clone <repository>
cd istorya-recipe-builder
npm install
cp .env.example .env
createdb istorya_recipes
npm run init-db
npm run dev
```

For users:
1. Navigate to deployed URL
2. Follow 4-step recipe builder
3. Create and save your Istorya recipe
4. Export or share as desired

## Support

- **Documentation**: See README.md and guides
- **Issues**: GitHub issue tracker
- **Community**: Discussion forums (coming soon)
- **Email**: Support contact (configure as needed)

---

**Project Status**: Production Ready v1.0.0
**Last Updated**: 2025-01-15
**Maintainer**: [Your Name/Organization]
