# AWS Deployment Troubleshooting Guide

## Current Issue: SSH Connection Timeout

### Step 1: Launch EC2 Instance
1. Go to AWS EC2 Console
2. Click "Launch Instance"
3. Choose Ubuntu 22.04 LTS
4. Instance type: t3.medium (recommended)
5. Create/select key pair
6. Configure Security Group:
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere
   - HTTPS (443) - Anywhere
   - Custom TCP (8080) - Anywhere
   - Custom TCP (7097) - Anywhere
   - Custom TCP (5173) - Anywhere

### Step 2: Update GitHub Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `EC2_HOST`: Your EC2 public IP address
- `EC2_USERNAME`: ubuntu
- `EC2_SSH_KEY`: Your private key content (entire .pem file)

### Step 3: Connect to EC2 and Setup
```bash
# SSH to your instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies
sudo apt update
sudo apt install -y docker.io docker-compose mysql-server openjdk-21-jdk nodejs npm nginx

# Clone your repository
git clone https://github.com/your-username/Online-Examination-Portal.git
cd Online-Examination-Portal

# Make scripts executable
chmod +x scripts/*.sh

# Setup MySQL databases
sudo mysql -e "CREATE DATABASE student_instructor_service_db;"
sudo mysql -e "CREATE DATABASE admin_service_db;"
sudo mysql -e "CREATE USER 'oep_user'@'localhost' IDENTIFIED BY 'SecurePassword123!';"
sudo mysql -e "GRANT ALL PRIVILEGES ON *.* TO 'oep_user'@'localhost';"
```

### Step 4: Test SSH Connection
```bash
# From your local machine
ssh -i your-key.pem ubuntu@your-ec2-ip "echo 'Connection successful'"
```

### Step 5: Manual Deployment Test
```bash
# On EC2 instance
cd /home/ubuntu/Online-Examination-Portal
./scripts/deploy.sh
```

## Alternative: Use Docker Compose
If manual setup is complex, use Docker:

```bash
# On EC2 instance
cd Online-Examination-Portal
docker-compose up -d
```

## Quick Local Test
If AWS is taking too long, run locally:
```bash
# Windows
quick-start.bat

# Or manually:
# Terminal 1: cd oep_spring_backend && mvn spring-boot:run
# Terminal 2: cd AdminServiceDotNET && dotnet run  
# Terminal 3: cd frontend-Application && npm run dev
```