#!/usr/bin/env fish

echo "==> Resetting and pulling..."
git checkout -- .
git pull

echo "==> Building frontend..."
cd frontend
bun install
bun run build
cd ..

echo "==> Building backend..."
cd backend
go build -o ../Xarth-Mai .

echo "==> Restarting service..."
systemctl restart Xarth-Mai

echo "✓ Deploy completed!"