# AllForYou - Deployment Guide

## Production Deployment Checklist

### Pre-deployment
- [ ] Set all environment variables
- [ ] Update API URLs to production endpoints
- [ ] Enable production optimizations
- [ ] Run security audit: `npm audit`
- [ ] Test production build locally
- [ ] Backup database

### Environment Variables

#### Server Production Variables
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_very_strong_random_secret_key_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
RATE_LIMIT_STRICT_MAX=5

# Uploads
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

#### Client Production Variables
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_ERROR_REPORTING=true
GENERATE_SOURCEMAP=false
```

## Deployment Options

### Option 1: Heroku

#### Server Deployment
```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main

# Scale
heroku ps:scale web=1
```

#### Client Deployment
1. Build the client: `cd client && npm run build`
2. Deploy build folder to Netlify/Vercel
3. Set environment variables in hosting platform

### Option 2: AWS EC2

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone repository
git clone https://github.com/benshabbat/AllForYou.git
cd AllForYou

# Install dependencies
npm run install-all

# Set up environment variables
nano server/.env  # Add your variables

# Build client
cd client && npm run build

# Start server with PM2
cd ../server
pm2 start server.js --name allergy-app
pm2 save
pm2 startup
```

### Option 3: Docker

```dockerfile
# Dockerfile for Server
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./
EXPOSE 5000
CMD ["node", "server.js"]
```

```dockerfile
# Dockerfile for Client
FROM node:18-alpine as build
WORKDIR /app
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  server:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo
  
  client:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - server
  
  mongo:
    image: mongo:latest
    volumes:
      - mongo-data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongo-data:
```

## Performance Optimization

### Server Optimizations
```javascript
// Enable compression
app.use(compression());

// Set proper cache headers
app.use('/uploads', express.static('uploads', {
  maxAge: '1y',
  immutable: true
}));

// Enable HTTP/2
// Use reverse proxy (nginx) with HTTP/2 enabled
```

### Client Optimizations
```javascript
// Code splitting
const RecipeList = lazy(() => import('./pages/recipeList'));

// Image optimization
- Use WebP format
- Implement lazy loading
- Use responsive images

// Service Worker for caching
- Use Workbox for PWA
```

## Monitoring & Logging

### Setup Error Tracking (Sentry)
```bash
npm install @sentry/node @sentry/react
```

```javascript
// Server
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Client
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### Setup Analytics (Google Analytics)
```javascript
// Add to client/public/index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## Security Hardening

### SSL/TLS Certificate
```bash
# Using Let's Encrypt with Certbot
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location / {
        root /var/www/html;
        try_files $uri /index.html;
    }
}
```

## Database Backup

### MongoDB Backup Script
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGO_URI" --out="/backup/mongo_$DATE"
find /backup -mtime +7 -delete  # Delete backups older than 7 days
```

## CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm run install-all
      
      - name: Run tests
        run: cd client && npm test -- --passWithNoTests
      
      - name: Build client
        run: cd client && npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to server
        run: |
          # Add deployment commands here
```

## Troubleshooting

### Common Issues
1. **CORS errors**: Check CORS configuration in server
2. **Database connection**: Verify MongoDB URI and network access
3. **Memory issues**: Increase Node memory: `NODE_OPTIONS=--max_old_space_size=4096`
4. **Port conflicts**: Change PORT in environment variables

### Logs
```bash
# PM2 logs
pm2 logs

# Docker logs
docker-compose logs -f

# System logs
tail -f /var/log/nginx/error.log
```
