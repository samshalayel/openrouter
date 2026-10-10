# VPS Credentials & Configuration Reference

## VPS Access Information

### Server Details
- **IP Address**: [YOUR_VPS_IP_ADDRESS]
- **Domain**: [YOUR_DOMAIN_NAME]
- **OS**: Ubuntu 20.04 LTS
- **Provider**: [YOUR_PROVIDER]

### SSH Access
```bash
# SSH into server
ssh -i /path/to/key.pem ubuntu@[YOUR_VPS_IP_ADDRESS]

# Or with password (if applicable)
ssh root@[YOUR_VPS_IP_ADDRESS]
```

### SSH Key Setup
```bash
# If using SSH key
chmod 600 ~/.ssh/id_rsa
ssh-add ~/.ssh/id_rsa

# Generate new key if needed
ssh-keygen -t rsa -b 4096 -f ~/.ssh/openrouter_key
```

## Application Credentials

### Database Configuration
```
Database Type: PostgreSQL
Host: localhost (or external host)
Port: 5432
Database Name: openrouter
Username: openrouter_user
Password: [SET_IN_VPS]
```

### Backend Environment
```
API URL: http://localhost:8000
Health Check: http://localhost:8000/health
API Docs: http://localhost:8000/docs
```

### Frontend Configuration
```
Frontend URL: http://localhost:3000
Node Version: 16+
Build Directory: .next/
Start Command: npm run start
```

## Important Ports

| Service | Port | Protocol | Status |
|---------|------|----------|--------|
| SSH | 22 | TCP | Internal |
| HTTP | 80 | TCP | External |
| HTTPS | 443 | TCP | External |
| Backend API | 8000 | TCP | Internal (via Nginx) |
| Frontend | 3000 | TCP | Internal (via Nginx) |
| PostgreSQL | 5432 | TCP | Internal |

## Service Management

### Backend (Supervisor)
```bash
# Check status
sudo supervisorctl status openrouter-backend

# Start/Stop/Restart
sudo supervisorctl start openrouter-backend
sudo supervisorctl stop openrouter-backend
sudo supervisorctl restart openrouter-backend

# View logs
tail -f /var/log/openrouter-backend.log
```

### Frontend (PM2)
```bash
# Check status
pm2 status

# Start/Stop/Restart
pm2 start openrouter-frontend
pm2 stop openrouter-frontend
pm2 restart openrouter-frontend

# View logs
pm2 logs openrouter-frontend
```

### Web Server (Nginx)
```bash
# Check status
sudo systemctl status nginx

# Start/Stop/Restart
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx

# Test config
sudo nginx -t

# View logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Database Backups

### Manual Backup
```bash
# Backup database
pg_dump -U openrouter_user -h localhost openrouter > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql -U openrouter_user -h localhost openrouter < backup_file.sql
```

### Automated Backup (Cron)
```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * pg_dump -U openrouter_user -h localhost openrouter > /backups/openrouter_$(date +\%Y\%m\%d).sql
```

## Monitoring & Health Checks

### Check All Services
```bash
# System health
free -h
df -h
top

# Services status
sudo supervisorctl status
pm2 status
sudo systemctl status nginx

# Check connectivity
curl http://localhost:8000/health
curl http://localhost:3000
```

### Log Aggregation
```bash
# Central log location
/var/log/openrouter-backend.log
/var/log/openrouter-frontend-out.log
/var/log/openrouter-frontend-error.log
/var/log/nginx/access.log
/var/log/nginx/error.log
```

## Common Issues & Solutions

### Service Won't Start
```bash
# Check disk space
df -h

# Check memory
free -h

# Restart all services
sudo supervisorctl reread
sudo supervisorctl update
sudo systemctl restart nginx
pm2 restart all
```

### Database Connection Failed
```bash
# Test connection
psql -U openrouter_user -h localhost -d openrouter

# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### High CPU/Memory Usage
```bash
# Find process using most resources
top

# Kill process if needed
kill -9 PID

# Restart service
pm2 restart openrouter-frontend
sudo supervisorctl restart openrouter-backend
```

## Security Checklist

- [ ] Change default SSH port (optional)
- [ ] Disable root SSH login
- [ ] Set up firewall rules
- [ ] Install fail2ban for brute-force protection
- [ ] Enable automatic security updates
- [ ] Set up SSL/TLS certificates
- [ ] Regular backups enabled
- [ ] Strong database passwords set
- [ ] API rate limiting configured
- [ ] CORS properly configured

## Update Procedure

### Backend Update
```bash
cd /opt/openrouter/backend
source venv/bin/activate
git pull origin main
pip install -r requirements.txt
sudo supervisorctl restart openrouter-backend
```

### Frontend Update
```bash
cd /opt/openrouter/frontend
git pull origin main
npm install
npm run build
pm2 restart openrouter-frontend
```

## Support Contacts

- **Project Repo**: https://github.com/samshalayel/openrouter
- **Issue Tracker**: https://github.com/samshalayel/openrouter/issues
- **Documentation**: See VPS_DEPLOYMENT_GUIDE.md

---

**Last Updated**: 2026-10-10
**Maintained By**: [Your Name/Team]
**Version**: 1.0
