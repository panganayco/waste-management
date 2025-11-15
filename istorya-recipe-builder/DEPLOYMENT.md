# Deployment Guide

This guide covers deploying the Istorya Recipe Builder to various platforms.

## Table of Contents
- [Heroku Deployment](#heroku-deployment)
- [AWS Deployment](#aws-deployment)
- [DigitalOcean Deployment](#digitalocean-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Post-Deployment](#post-deployment)

## Heroku Deployment

### Prerequisites
- Heroku account
- Heroku CLI installed
- Git repository

### Steps

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create istorya-recipe-builder
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set ALLOWED_ORIGINS=https://istorya-recipe-builder.herokuapp.com
   heroku config:set RATE_LIMIT_WINDOW_MS=900000
   heroku config:set RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Initialize Database**
   ```bash
   heroku run npm run init-db
   ```

7. **Open Application**
   ```bash
   heroku open
   ```

### Heroku-Specific Configuration

Add a `Procfile` in your project root:
```
web: node server/index.js
```

The database URL is automatically set by Heroku as `DATABASE_URL`. Update `server/db/database.js` to use it:

```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

## AWS Deployment

### Using AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB**
   ```bash
   eb init -p node.js istorya-recipe-builder
   ```

3. **Create Environment**
   ```bash
   eb create istorya-production
   ```

4. **Set Environment Variables**
   ```bash
   eb setenv NODE_ENV=production \
     DB_HOST=your-rds-endpoint.rds.amazonaws.com \
     DB_PORT=5432 \
     DB_NAME=istorya_recipes \
     DB_USER=postgres \
     DB_PASSWORD=your-password \
     ALLOWED_ORIGINS=https://your-domain.com
   ```

5. **Deploy**
   ```bash
   eb deploy
   ```

### AWS RDS for PostgreSQL

1. **Create RDS Instance**
   - Go to AWS RDS Console
   - Create PostgreSQL database
   - Note the endpoint, username, and password

2. **Configure Security Groups**
   - Allow inbound connections from your EB environment
   - Port 5432 for PostgreSQL

3. **Connect and Initialize**
   ```bash
   # SSH into EB instance
   eb ssh

   # Run database initialization
   npm run init-db
   ```

## DigitalOcean Deployment

### Using App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository
   - Select branch: `main`

2. **Configure Build Settings**
   - Build Command: `npm install`
   - Run Command: `npm start`

3. **Add Database**
   - Add a PostgreSQL database component
   - Note the connection details

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   DB_HOST=${db.HOSTNAME}
   DB_PORT=${db.PORT}
   DB_NAME=${db.DATABASE}
   DB_USER=${db.USERNAME}
   DB_PASSWORD=${db.PASSWORD}
   ALLOWED_ORIGINS=https://your-app.ondigitalocean.app
   ```

5. **Deploy**
   - Click "Create Resources"
   - Wait for deployment to complete

6. **Initialize Database**
   - Use the console access to run:
   ```bash
   npm run init-db
   ```

### Using Droplets (Manual)

1. **Create Ubuntu Droplet**
   ```bash
   # SSH into droplet
   ssh root@your-droplet-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PostgreSQL**
   ```bash
   sudo apt-get install postgresql postgresql-contrib
   sudo -u postgres createuser --interactive
   sudo -u postgres createdb istorya_recipes
   ```

4. **Clone and Setup**
   ```bash
   git clone https://github.com/your-repo/istorya-recipe-builder.git
   cd istorya-recipe-builder
   npm install
   cp .env.example .env
   # Edit .env with your settings
   npm run init-db
   ```

5. **Install PM2**
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name istorya
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Enable SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server/index.js"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_PORT=5432
      - DB_NAME=istorya_recipes
      - DB_USER=postgres
      - DB_PASSWORD=secretpassword
      - ALLOWED_ORIGINS=http://localhost:3000
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=istorya_recipes
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=secretpassword
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Deploy with Docker Compose

```bash
# Build and start
docker-compose up -d

# Initialize database
docker-compose exec app npm run init-db

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `istorya_recipes` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `your_password` |
| `ALLOWED_ORIGINS` | CORS origins | `https://yourdomain.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `GA_TRACKING_ID` | Google Analytics ID | `""` |
| `MIXPANEL_TOKEN` | Mixpanel token | `""` |

## Database Setup

### PostgreSQL Configuration for Production

1. **Create dedicated database user**
   ```sql
   CREATE USER istorya_app WITH PASSWORD 'strong_password';
   GRANT ALL PRIVILEGES ON DATABASE istorya_recipes TO istorya_app;
   ```

2. **Configure connection pooling**
   - Update `server/db/database.js`:
   ```javascript
   const pool = new Pool({
     max: 20, // Maximum pool size
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000,
   });
   ```

3. **Set up backups**
   ```bash
   # Daily backup cron job
   0 2 * * * pg_dump istorya_recipes > /backups/istorya_$(date +\%Y\%m\%d).sql
   ```

4. **Enable query logging** (for monitoring)
   ```sql
   ALTER DATABASE istorya_recipes SET log_statement = 'all';
   ```

## Post-Deployment

### 1. Health Check
```bash
curl https://your-domain.com/api/health
```

### 2. Test Recipe Creation
```bash
curl -X POST https://your-domain.com/api/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_session",
    "constellationSelections": [],
    "ingredients": [],
    "summary": "Test recipe"
  }'
```

### 3. Monitor Logs

**Heroku:**
```bash
heroku logs --tail
```

**PM2:**
```bash
pm2 logs istorya
```

**Docker:**
```bash
docker-compose logs -f app
```

### 4. Set Up Monitoring

- **Application Monitoring**: New Relic, Datadog, or AppSignal
- **Error Tracking**: Sentry
- **Uptime Monitoring**: UptimeRobot or Pingdom
- **Analytics**: Google Analytics, Mixpanel

### 5. Performance Optimization

1. **Enable CDN** for static assets
2. **Configure caching headers**
3. **Enable database query caching**
4. **Set up application-level caching** (Redis)
5. **Optimize database indexes**

### 6. Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database password is strong
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Security headers configured (Helmet)
- [ ] Regular security updates scheduled
- [ ] Database backups automated
- [ ] Admin endpoints protected
- [ ] SQL injection prevention verified

## Troubleshooting

### Database Connection Issues
```bash
# Test database connection
psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# Check environment variables
env | grep DB_
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Application Crashes
```bash
# Check logs
npm run dev # Development mode for detailed errors

# Verify all dependencies installed
npm install

# Check database schema
npm run init-db
```

## Rollback Procedure

### Heroku
```bash
# List releases
heroku releases

# Rollback to previous version
heroku rollback v123
```

### Docker
```bash
# Use specific version
docker-compose down
git checkout <previous-tag>
docker-compose up -d
```

### Manual
```bash
git revert <commit-hash>
git push origin main
pm2 restart istorya
```

## Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Review recent code changes
5. Open an issue on GitHub with details
