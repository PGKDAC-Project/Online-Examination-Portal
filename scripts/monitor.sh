#!/bin/bash

# Check system resources
echo "=== System Resources ==="
free -h
df -h /
echo

# Check services
echo "=== Service Status ==="
sudo systemctl status oep-backend --no-pager -l
sudo systemctl status oep-admin --no-pager -l
sudo systemctl status nginx --no-pager -l
echo

# Check application logs
echo "=== Recent Errors ==="
sudo journalctl -u oep-backend --since "1 hour ago" --grep ERROR --no-pager || echo "No errors found"
sudo journalctl -u oep-admin --since "1 hour ago" --grep ERROR --no-pager || echo "No errors found"