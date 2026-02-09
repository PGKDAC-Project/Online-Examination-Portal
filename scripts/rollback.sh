#!/bin/bash

BACKUP_DIR=$1

if [ -z "$BACKUP_DIR" ]; then
    echo "Usage: ./rollback.sh backup-YYYYMMDD-HHMMSS"
    echo "Available backups:"
    ls -la /home/ubuntu/backup-* 2>/dev/null || echo "No backups found"
    exit 1
fi

echo "🔄 Rolling back to $BACKUP_DIR..."

# Stop services
sudo systemctl stop oep-backend oep-admin

# Restore backup
sudo rm -rf /home/ubuntu/online-exam-portal
sudo cp -r /home/ubuntu/$BACKUP_DIR /home/ubuntu/online-exam-portal
sudo chown -R ubuntu:ubuntu /home/ubuntu/online-exam-portal

# Start services
sudo systemctl start oep-backend oep-admin

echo "✅ Rollback completed"