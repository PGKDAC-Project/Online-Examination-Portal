#!/bin/bash

# Online Examination Portal - Production Deployment Script

echo "Starting Online Examination Portal deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
mkdir -p logs
mkdir -p backups

# Set environment variables for production
export MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD:-"secure_root_password"}
export MYSQL_PASSWORD=${MYSQL_PASSWORD:-"secure_user_password"}
export JWT_SECRET=${JWT_SECRET:-"617b7c292a0698a897e6ff73324285be2ca049857c8802e26a4cce2214d899c4"}

# Build and start services
echo "Building and starting services..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 30

# Check service health
echo "Checking service health..."

# Check MySQL
if docker-compose exec mysql mysqladmin ping -h localhost --silent; then
    echo "✓ MySQL is running"
else
    echo "✗ MySQL is not responding"
    exit 1
fi

# Check Spring Boot backend
if curl -f http://localhost:8080/oep/actuator/health > /dev/null 2>&1; then
    echo "✓ Spring Boot backend is running"
else
    echo "✗ Spring Boot backend is not responding"
fi

# Check .NET Admin Service
if curl -f http://localhost:7097/health > /dev/null 2>&1; then
    echo "✓ .NET Admin Service is running"
else
    echo "✗ .NET Admin Service is not responding"
fi

# Check Frontend
if curl -f http://localhost:5173 > /dev/null 2>&1; then
    echo "✓ Frontend is running"
else
    echo "✗ Frontend is not responding"
fi

echo "Deployment completed!"
echo "Access the application at: http://localhost:5173"
echo "Admin API documentation: http://localhost:7097/swagger"
echo "Spring Boot API documentation: http://localhost:8080/oep/swagger-ui.html"

# Show running containers
echo "Running containers:"
docker-compose ps