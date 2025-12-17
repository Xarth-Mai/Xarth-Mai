#!/usr/bin/env fish

echo "==> Resetting and pulling..."
git checkout -- .
and git pull
and echo "==> Building frontend..."
and cd frontend
and bun install
and bun run build
and cd ..
and echo "==> Building fightingGame..."
and mkdir -p dist/fightingGame
and cp -r fightingGame dist/
and bun build fightingGame/index.js --outfile=dist/fightingGame/index.js --minify
and echo "==> Building backend..."
and cd backend
and go build -o ../Xarth-Mai .
and echo "==> Restarting service..."
and systemctl restart Xarth-Mai
and echo "✓ Deploy completed!"