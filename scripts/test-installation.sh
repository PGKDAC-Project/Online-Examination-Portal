#!/bin/bash

echo "=========================================="
echo "Testing EC2 Installation"
echo "=========================================="
echo ""

# Test Java
echo "1. Testing Java..."
if command -v java &> /dev/null; then
    java -version
    echo "✅ Java installed"
else
    echo "❌ Java NOT installed"
fi
echo ""

# Test Maven
echo "2. Testing Maven..."
if command -v mvn &> /dev/null; then
    mvn -version
    echo "✅ Maven installed"
else
    echo "❌ Maven NOT installed"
fi
echo ""

# Test .NET
echo "3. Testing .NET..."
if command -v dotnet &> /dev/null; then
    dotnet --version
    echo "✅ .NET installed"
else
    echo "❌ .NET NOT installed"
fi
echo ""

# Test Node.js
echo "4. Testing Node.js..."
if command -v node &> /dev/null; then
    node -v
    echo "✅ Node.js installed"
else
    echo "❌ Node.js NOT installed"
fi
echo ""

# Test npm
echo "5. Testing npm..."
if command -v npm &> /dev/null; then
    npm -v
    echo "✅ npm installed"
else
    echo "❌ npm NOT installed"
fi
echo ""

# Test MySQL
echo "6. Testing MySQL..."
if systemctl is-active --quiet mysql; then
    mysql --version
    echo "✅ MySQL running"
else
    echo "❌ MySQL NOT running"
fi
echo ""

# Test MySQL databases
echo "7. Testing MySQL databases..."
mysql -u oep_user -pSecurePassword123! -e "SHOW DATABASES;" 2>/dev/null | grep -E "student_instructor_service_db|admin_service_db"
if [ $? -eq 0 ]; then
    echo "✅ Databases exist"
else
    echo "❌ Databases NOT found"
fi
echo ""

# Test Nginx
echo "8. Testing Nginx..."
if systemctl is-active --quiet nginx; then
    nginx -v
    echo "✅ Nginx running"
else
    echo "❌ Nginx NOT running"
fi
echo ""

# Test Git
echo "9. Testing Git..."
if command -v git &> /dev/null; then
    git --version
    echo "✅ Git installed"
else
    echo "❌ Git NOT installed"
fi
echo ""

# Test ports
echo "10. Testing open ports..."
echo "Port 22 (SSH):"
sudo netstat -tlnp | grep :22 || echo "❌ Port 22 not listening"
echo "Port 80 (HTTP):"
sudo netstat -tlnp | grep :80 || echo "❌ Port 80 not listening"
echo ""

echo "=========================================="
echo "Installation Test Complete"
echo "=========================================="
