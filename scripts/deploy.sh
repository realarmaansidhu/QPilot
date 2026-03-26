#!/bin/bash
# ============================================================
#  QPilot — Backend Deployment Script (Oracle Cloud VM)
#  Run from project root: bash scripts/deploy.sh
# ============================================================

set -e

echo "=== QPilot Backend Deployment ==="

# Pull latest code
echo "[1/4] Pulling latest code..."
git pull origin main

# Activate virtual environment
echo "[2/4] Activating virtual environment..."
source backend/environ/bin/activate

# Install dependencies
echo "[3/4] Installing dependencies..."
pip install -r backend/requirements.txt --quiet

# Restart services
echo "[4/4] Restarting services..."
# Using systemd (preferred) — create service files first
# sudo systemctl restart qpilot-api
# sudo systemctl restart qpilot-worker

# Or using basic process management:
pkill -f "uvicorn main:app" || true
sleep 2
cd backend
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > /var/log/qpilot/api.log 2>&1 &

echo "=== Deployment complete ==="
echo "API running on port 8000"
