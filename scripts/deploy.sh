#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Set environment variables
export DB_USERNAME="oep_user"
export DB_PASSWORD="${DB_PASSWORD:-SecurePassword123!}"
export DB_HOST="localhost"
export DB_NAME_MAIN="student_instructor_service_db"
export DB_NAME_ADMIN="admin_service_db"
export JWT_SECRET="${JWT_SECRET:-617b7c292a0698a897e6ff73324285be2ca049857c8802e26a4cce2214d899c4}"
export SPRING_BACKEND_URL="http://localhost:9090/oep"
export ADMIN_SERVICE_URL="http://localhost:7097"
export FRONTEND_URL="http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'localhost')"
export FRONTEND_RESET_URL="${FRONTEND_URL}/auth/reset-password"

# Get email credentials from environment (set by GitHub Actions)
if [ -z "$MAIL_USERNAME" ] || [ -z "$MAIL_PASSWORD" ]; then
    print_warning "Email credentials not set. Email functionality will be disabled."
else
    print_status "Email credentials configured"
fi

print_status "Environment variables configured"

# Stop services
print_status "Stopping services..."
sudo systemctl stop oep-backend oep-admin || print_warning "Services may not be running"

# Backup current deployment
print_status "Creating backup..."
sudo cp -r /home/ubuntu/online-exam-portal /home/ubuntu/backup-$(date +%Y%m%d-%H%M%S) || true

# Update React environment file
print_status "Updating React environment..."
cd /home/ubuntu/online-exam-portal/frontend-Application
cat > .env.production << EOF
VITE_API_BASE_URL=${FRONTEND_URL}:9090/oep
VITE_ADMIN_API_BASE_URL=${FRONTEND_URL}:7097
VITE_APP_NAME=Online Examination Portal
VITE_APP_VERSION=1.0.0
EOF

# Build Spring Boot with production profile
print_status "Building Spring Boot application..."
cd /home/ubuntu/online-exam-portal/oep_spring_backend
mvn clean package -DskipTests -Dspring.profiles.active=prod -q

if [ $? -ne 0 ]; then
    print_error "Spring Boot build failed"
    exit 1
fi

# Update systemd service file for Spring Boot
print_status "Configuring Spring Boot service..."
sudo tee /etc/systemd/system/oep-backend.service > /dev/null <<EOF
[Unit]
Description=Online Examination Portal - Spring Boot Backend
After=network.target mysql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/online-exam-portal/oep_spring_backend
ExecStart=/usr/bin/java -jar target/exam_portal_backend-0.0.1-SNAPSHOT.jar --server.port=9090
Restart=on-failure
RestartSec=10

Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="DB_USERNAME=${DB_USERNAME}"
Environment="DB_PASSWORD=${DB_PASSWORD}"
Environment="JWT_SECRET=${JWT_SECRET}"
Environment="MAIL_USERNAME=${MAIL_USERNAME}"
Environment="MAIL_PASSWORD=${MAIL_PASSWORD}"
Environment="FRONTEND_RESET_URL=${FRONTEND_RESET_URL}"
Environment="ADMIN_SERVICE_URL=${ADMIN_SERVICE_URL}"

StandardOutput=journal
StandardError=journal
SyslogIdentifier=oep-backend

[Install]
WantedBy=multi-user.target
EOF

# Build .NET Admin Service
print_status "Building .NET Admin Service..."
cd /home/ubuntu/online-exam-portal/AdminServiceDotNET
dotnet publish -c Release -o ./publish --nologo -v q

if [ $? -ne 0 ]; then
    print_error ".NET build failed"
    exit 1
fi

# Update systemd service file for Admin Service
print_status "Configuring Admin Service..."
sudo tee /etc/systemd/system/oep-admin.service > /dev/null <<EOF
[Unit]
Description=Online Examination Portal - Admin Service (.NET)
After=network.target mysql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/online-exam-portal/AdminServiceDotNET/publish
ExecStart=/usr/bin/dotnet AdminServiceDotNET.dll
Restart=on-failure
RestartSec=10

Environment="ASPNETCORE_ENVIRONMENT=Production"
Environment="DB_PASSWORD=${DB_PASSWORD}"
Environment="JWT_SECRET=${JWT_SECRET}"

StandardOutput=journal
StandardError=journal
SyslogIdentifier=oep-admin

[Install]
WantedBy=multi-user.target
EOF

# Build React Frontend
print_status "Building React Frontend..."
cd /home/ubuntu/online-exam-portal/frontend-Application
npm ci --silent
npm run build

if [ $? -ne 0 ]; then
    print_error "React build failed"
    exit 1
fi

# Update Nginx static files
print_status "Updating Nginx static files..."
sudo rm -rf /var/www/html/oep
sudo mkdir -p /var/www/html/oep
sudo cp -r dist/* /var/www/html/oep/
sudo chown -R www-data:www-data /var/www/html/oep

# Start services
print_status "Reloading systemd and starting services..."
sudo systemctl daemon-reload
sudo systemctl enable oep-backend oep-admin
sudo systemctl start oep-backend
sudo systemctl start oep-admin

# Wait for services to start
sleep 10

# Check service status
print_status "Checking service status..."
if sudo systemctl is-active --quiet oep-backend; then
    print_status "Spring Boot service is running"
else
    print_error "Spring Boot service failed to start"
    sudo journalctl -u oep-backend --no-pager -n 20
    exit 1
fi

if sudo systemctl is-active --quiet oep-admin; then
    print_status "Admin service is running"
else
    print_error "Admin service failed to start"
    sudo journalctl -u oep-admin --no-pager -n 20
    exit 1
fi

# Reload Nginx
print_status "Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

print_status "✅ Deployment completed successfully!"
print_status "Frontend: ${FRONTEND_URL}"
print_status "API: ${FRONTEND_URL}:9090/oep"
print_status "Admin: ${FRONTEND_URL}:7097"

# Clean up old backups (keep last 5)
print_status "Cleaning up old backups..."
cd /home/ubuntu
ls -t backup-* 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null || true

echo "🎉 Deployment finished at $(date)"