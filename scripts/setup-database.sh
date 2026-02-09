#!/bin/bash

echo "🗄️ Setting up databases..."

# MySQL root password (change this to your actual root password)
MYSQL_ROOT_PASSWORD="manager"

# Application database credentials
DB_USERNAME="oep_user"
DB_PASSWORD="SecurePassword123!"

# Create databases and user
mysql -u root -p${MYSQL_ROOT_PASSWORD} << EOF
-- Create databases
CREATE DATABASE IF NOT EXISTS student_instructor_service_db;
CREATE DATABASE IF NOT EXISTS admin_service_db;

-- Create user
CREATE USER IF NOT EXISTS '${DB_USERNAME}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
CREATE USER IF NOT EXISTS '${DB_USERNAME}'@'%' IDENTIFIED BY '${DB_PASSWORD}';

-- Grant permissions
GRANT ALL PRIVILEGES ON student_instructor_service_db.* TO '${DB_USERNAME}'@'localhost';
GRANT ALL PRIVILEGES ON admin_service_db.* TO '${DB_USERNAME}'@'localhost';
GRANT ALL PRIVILEGES ON student_instructor_service_db.* TO '${DB_USERNAME}'@'%';
GRANT ALL PRIVILEGES ON admin_service_db.* TO '${DB_USERNAME}'@'%';

FLUSH PRIVILEGES;

-- Show databases to verify
SHOW DATABASES;
EOF

echo "✅ Database setup completed"
echo "Database user: ${DB_USERNAME}"
echo "Databases created: student_instructor_service_db, admin_service_db"