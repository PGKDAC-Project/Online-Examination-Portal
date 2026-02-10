# Email Configuration Guide

## Overview
The Spring Boot application uses JavaMailSender for password reset functionality. Email credentials are configured via environment variables for security.

## Current Configuration

### application.properties
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.from=${MAIL_USERNAME}
logging.level.org.springframework.mail=DEBUG
```

## Setup Instructions

### 1. Gmail Configuration (Recommended)

#### Enable 2-Factor Authentication
1. Go to Google Account Settings
2. Navigate to Security
3. Enable 2-Step Verification

#### Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Name it "Online Exam Portal"
4. Copy the 16-character password

### 2. Configure GitHub Secrets

Add these secrets in your repository:

| Secret Name | Value | Example |
|------------|-------|---------|
| `MAIL_USERNAME` | Your Gmail address | `examportal@gmail.com` |
| `MAIL_PASSWORD` | App-specific password | `abcd efgh ijkl mnop` |

### 3. Deployment Flow

The deployment automatically:
1. Receives secrets from GitHub Actions
2. Passes them to the deployment script
3. Injects them into systemd service file
4. Spring Boot reads them at runtime

## Testing Email Functionality

### Test Locally
```bash
# Set environment variables
export MAIL_USERNAME="your-email@gmail.com"
export MAIL_PASSWORD="your-app-password"

# Run Spring Boot
cd oep_spring_backend
mvn spring-boot:run
```

### Test Password Reset
```bash
# Request password reset
curl -X POST http://localhost:9090/oep/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Check Logs
```bash
# On EC2
sudo journalctl -u oep-backend -f | grep mail

# Look for:
# - "Sending password reset email to..."
# - SMTP connection logs
# - Any authentication errors
```

## Troubleshooting

### Issue 1: Authentication Failed
**Error:** `535-5.7.8 Username and Password not accepted`

**Solutions:**
- Verify 2FA is enabled on Gmail
- Regenerate app password
- Check MAIL_USERNAME is the full email address
- Ensure no spaces in MAIL_PASSWORD

### Issue 2: Connection Timeout
**Error:** `Could not connect to SMTP host`

**Solutions:**
- Check EC2 security group allows outbound port 587
- Verify firewall rules: `sudo ufw status`
- Test connectivity: `telnet smtp.gmail.com 587`

### Issue 3: TLS/SSL Errors
**Error:** `STARTTLS is required`

**Solutions:**
- Verify `starttls.enable=true` in properties
- Check Java version supports TLS 1.2+
- Update Java if needed: `sudo apt update && sudo apt install openjdk-21-jdk`

### Issue 4: Email Not Received
**Checklist:**
- Check spam/junk folder
- Verify recipient email exists in database
- Check Gmail "Sent" folder
- Review application logs for errors

## Alternative Email Providers

### AWS SES
```properties
spring.mail.host=email-smtp.us-east-1.amazonaws.com
spring.mail.port=587
spring.mail.username=${AWS_SES_USERNAME}
spring.mail.password=${AWS_SES_PASSWORD}
```

### SendGrid
```properties
spring.mail.host=smtp.sendgrid.net
spring.mail.port=587
spring.mail.username=apikey
spring.mail.password=${SENDGRID_API_KEY}
```

### Outlook/Office 365
```properties
spring.mail.host=smtp.office365.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
```

## Security Best Practices

✅ **DO:**
- Use app-specific passwords, not account passwords
- Store credentials in GitHub Secrets
- Enable 2FA on email account
- Use environment variables in production
- Rotate passwords periodically

❌ **DON'T:**
- Hardcode credentials in code
- Commit credentials to Git
- Share app passwords
- Use personal email for production
- Disable TLS/SSL

## Monitoring

### Check Service Status
```bash
sudo systemctl status oep-backend
```

### View Email Logs
```bash
# Real-time logs
sudo journalctl -u oep-backend -f | grep -i mail

# Last 100 lines
sudo journalctl -u oep-backend -n 100 | grep -i mail
```

### Verify Environment Variables
```bash
# Check if variables are set
sudo systemctl show oep-backend | grep Environment
```

## Production Checklist

- [ ] Gmail 2FA enabled
- [ ] App password generated
- [ ] GitHub secrets configured
- [ ] Deployment successful
- [ ] Service running without errors
- [ ] Test email sent successfully
- [ ] Password reset flow tested
- [ ] Logs show no SMTP errors
- [ ] Email received in inbox

---

**Last Updated:** 2025-01-XX
