# Deployment Troubleshooting Guide

## Critical Issues Fixed

### 1. ✅ Health Check Port Mismatch (RESOLVED)
**Problem:** Workflow checked port 8080, but Spring Boot runs on port 9090
**Fix:** Updated `.github/workflows/deploy.yml` line 76 to use port 9090

### 2. ✅ Hardcoded Secrets (RESOLVED)
**Problem:** Credentials hardcoded in `deploy.sh`
**Fix:** Now uses GitHub secrets with fallback values

### 3. ✅ Missing Debug Logs (RESOLVED)
**Problem:** No visibility into deployment failures
**Fix:** Added debug step that runs on failure

---

## Required GitHub Secrets

Ensure these secrets are configured in your repository:

```
Settings → Secrets and variables → Actions → New repository secret
```

| Secret Name | Description | Example |
|------------|-------------|---------|
| `EC2_HOST` | EC2 public IP or domain | `54.123.45.67` |
| `EC2_USERNAME` | SSH username | `ubuntu` |
| `EC2_SSH_KEY` | Private key content | Content of `oep.pem` |
| `DB_PASSWORD` | Database password | `SecurePassword123!` |
| `JWT_SECRET` | JWT signing key | `617b7c292a...` |
| `MAIL_USERNAME` | SMTP email (Gmail) | `examportal@gmail.com` |
| `MAIL_PASSWORD` | Gmail app password | `abcd efgh ijkl mnop` |

---

## Common Deployment Failures

### Issue 1: SSH Connection Failed
**Symptoms:**
```
Error: dial tcp: lookup <host>: no such host
```

**Solutions:**
- Verify `EC2_HOST` secret contains correct IP
- Check EC2 security group allows SSH (port 22) from GitHub Actions IPs
- Ensure EC2 instance is running

### Issue 2: Health Check Timeout
**Symptoms:**
```
curl: (7) Failed to connect to <host> port 9090
```

**Solutions:**
- Check EC2 security group allows inbound traffic on ports 9090, 7097
- Verify services are running: `sudo systemctl status oep-backend oep-admin`
- Check logs: `sudo journalctl -u oep-backend -n 50`

### Issue 3: Database Connection Failed
**Symptoms:**
```
Communications link failure
```

**Solutions:**
- Verify MySQL is running: `sudo systemctl status mysql`
- Check database exists: `mysql -u oep_user -p -e "SHOW DATABASES;"`
- Verify credentials in systemd service files

### Issue 4: Build Failures
**Symptoms:**
```
[ERROR] Failed to execute goal
```

**Solutions:**
- Check Java version: `java -version` (should be 21)
- Verify Maven installation: `mvn -version`
- Check .NET SDK: `dotnet --version` (should be 8.0)
- Review build logs in GitHub Actions

---

## Manual Deployment Commands

If automated deployment fails, SSH into EC2 and run:

```bash
# Navigate to project
cd /home/ubuntu/online-exam-portal
git pull origin main

# Set environment variables
export DB_PASSWORD="your-password"
export JWT_SECRET="your-secret"
export MAIL_USERNAME="your-email"
export MAIL_PASSWORD="your-password"

# Run deployment
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

---

## Checking Service Status

```bash
# Check if services are running
sudo systemctl status oep-backend
sudo systemctl status oep-admin
sudo systemctl status nginx

# View recent logs
sudo journalctl -u oep-backend -n 100 --no-pager
sudo journalctl -u oep-admin -n 100 --no-pager

# Test endpoints locally
curl http://localhost:9090/oep/actuator/health
curl http://localhost:7097/health

# Check listening ports
sudo netstat -tlnp | grep -E '9090|7097|80'
```

---

## Rollback Procedure

If deployment fails, rollback to previous version:

```bash
# Stop services
sudo systemctl stop oep-backend oep-admin

# Find latest backup
ls -lt /home/ubuntu/backup-* | head -1

# Restore backup (replace timestamp)
sudo rm -rf /home/ubuntu/online-exam-portal
sudo cp -r /home/ubuntu/backup-YYYYMMDD-HHMMSS /home/ubuntu/online-exam-portal

# Restart services
sudo systemctl start oep-backend oep-admin
```

---

## Verifying Deployment

After successful deployment, verify:

1. **Frontend:** `http://<EC2_HOST>`
2. **Spring Boot API:** `http://<EC2_HOST>:9090/oep/actuator/health`
3. **Admin API:** `http://<EC2_HOST>:7097/health`
4. **Login:** Test with admin credentials

---

## Performance Monitoring

```bash
# Check system resources
htop

# Monitor logs in real-time
sudo journalctl -u oep-backend -f

# Check disk space
df -h

# Check memory usage
free -h
```

---

## Security Checklist

- [ ] SSH key has correct permissions (400)
- [ ] Security groups restrict access to necessary ports only
- [ ] Database password is strong and not default
- [ ] JWT secret is randomly generated (64+ characters)
- [ ] Email credentials use app-specific passwords
- [ ] HTTPS is configured (recommended for production)
- [ ] Firewall rules are properly configured

---

## Getting Help

If issues persist:

1. Check GitHub Actions logs for detailed error messages
2. Review EC2 system logs: `sudo journalctl -xe`
3. Verify all prerequisites are installed
4. Ensure EC2 instance has sufficient resources (2GB+ RAM recommended)
5. Check application logs in `/home/ubuntu/online-exam-portal/logs/`

---

**Last Updated:** 2025-01-XX
