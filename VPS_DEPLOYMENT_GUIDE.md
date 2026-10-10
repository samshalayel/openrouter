# VPS Deployment Guide - OpenRouter Project

## Project Overview
OpenRouter is a full-stack application with:
- **Backend**: FastAPI Python application
- **Frontend**: Next.js React application  
- **Database**: PostgreSQL/MySQL database layer

## VPS Setup Instructions

### Prerequisites
```bash
# System requirements
- Ubuntu 20.04 LTS or similar
- 2GB+ RAM
- 20GB+ disk space
- Python 3.9+
- Node.js 16+
- PostgreSQL/MySQL
```

### Step 1: System Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y python3-pip python3-venv node npm postgresql postgresql-contrib
sudo apt install -y git curl wget nginx supervisor
```

### Step 2: Clone Repository

```bash
cd /opt
sudo git clone https://github.com/samshalayel/openrouter.git
cd openrouter
sudo chown -R $USER:$USER .
```

### Step 3: Backend Setup

```bash
cd /opt/openrouter/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install --upgrade pip
pip install -r requirements.txt

# Create environment file
cat > .env << 'ENVEOF'
DATABASE_URL=postgresql://user:password@localhost:5432/openrouter
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVEOF

# Initialize database
python -c "from app.models import Base; from app.database import engine; Base.metadata.create_all(bind=engine)"
```

### Step 4: Frontend Setup

```bash
cd /opt/openrouter/frontend

# Install dependencies
npm install

# Create environment file
cat > .env.local << 'ENVEOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=OpenRouter
ENVEOF

# Build application
npm run build
```

### Step 5: Database Configuration

```bash
# Connect to PostgreSQL
sudo sudo -u postgres psql

# Create database and user
CREATE DATABASE openrouter;
CREATE USER openrouter_user WITH PASSWORD 'secure_password';
ALTER ROLE openrouter_user SET client_encoding TO 'utf8';
ALTER ROLE openrouter_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE openrouter_user SET default_transaction_deferrable TO on;
ALTER ROLE openrouter_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE openrouter TO openrouter_user;
\q
```

### Step 6: Service Configuration

#### Backend Service (Supervisor)

```bash
sudo tee /etc/supervisor/conf.d/openrouter-backend.conf > /dev/null << 'CONFEOF'
[program:openrouter-backend]
directory=/opt/openrouter/backend
command=/opt/openrouter/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
user=$USER
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/openrouter-backend.log
environment=PATH="/opt/openrouter/backend/venv/bin"
CONFEOF

sudo supervisorctl reread
sudo supervisorctl update
```

#### Frontend Service (PM2)

```bash
# Install PM2 globally
sudo npm install -g pm2

cd /opt/openrouter/frontend

# Create PM2 configuration
cat > ecosystem.config.js << 'PMEOF'
module.exports = {
  apps: [{
    name: 'openrouter-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/opt/openrouter/frontend',
    instances: 1,
    exec_mode: 'cluster',
    error_file: '/var/log/openrouter-frontend-error.log',
    out_file: '/var/log/openrouter-frontend-out.log'
  }]
};
PMEOF

pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 7: Nginx Configuration

```bash
sudo tee /etc/nginx/sites-available/openrouter > /dev/null << 'NGINXEOF'
upstream backend {
    server 127.0.0.1:8000;
}

upstream frontend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health checks
    location /health {
        access_log off;
        proxy_pass http://backend/health;
    }
}
NGINXEOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/openrouter /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
sudo certbot renew --dry-run
```

### Step 9: Monitoring & Logs

```bash
# View supervisor logs
tail -f /var/log/openrouter-backend.log

# View PM2 logs
pm2 logs

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check services status
sudo supervisorctl status
pm2 status
```

## Environment Variables Required

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
API_PORT=8000
DEBUG=false
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_APP_NAME=OpenRouter
NEXT_PUBLIC_LOG_LEVEL=info
```

## Deployment Checklist

- [ ] System updated and dependencies installed
- [ ] Repository cloned
- [ ] Python virtual environment created
- [ ] Backend dependencies installed
- [ ] Frontend npm packages installed
- [ ] Database created and configured
- [ ] Environment files created with secure credentials
- [ ] Backend running via Supervisor
- [ ] Frontend running via PM2
- [ ] Nginx configured as reverse proxy
- [ ] SSL certificate installed
- [ ] Firewall configured (ports 80, 443 open)
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting set up

## Troubleshooting

### Backend won't start
```bash
cd /opt/openrouter/backend
source venv/bin/activate
python -m app.main  # Test directly
```

### Frontend connection issues
```bash
# Check if frontend is running
pm2 status

# Restart frontend
cd /opt/openrouter/frontend
npm run build
pm2 restart openrouter-frontend
```

### Database connection error
```bash
# Test database connection
psql -U openrouter_user -d openrouter -h localhost
```

### Nginx errors
```bash
# Test nginx configuration
sudo nginx -t

# View error log
sudo tail -f /var/log/nginx/error.log
```

## Security Recommendations

1. **Firewall Configuration**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **Keep System Updated**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Regular Backups**
   ```bash
   # Database backup
   pg_dump -U openrouter_user openrouter > /backup/openrouter.sql
   ```

4. **Monitor Resources**
   ```bash
   # CPU and Memory
   top
   free -h
   df -h
   ```

## Support & Documentation

- Backend API Docs: `https://your-domain.com/docs`
- Frontend Source: `./frontend/`
- Backend Source: `./backend/`
- Database Schema: Check `./backend/app/models/`

---

Generated: 2026-10-10
Project: OpenRouter - VPS Deployment
