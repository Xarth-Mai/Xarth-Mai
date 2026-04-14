#!/bin/bash

# Exit on error
set -e

echo "==> Cleaning up old builds..."
rm -rf dist Xarth-Mai

echo "==> Building frontend..."
cd frontend
bun install
bun run build
cd ..

echo "==> Building backend..."
cd backend
cargo build --release
cd ..

echo "==> Copying build artifacts to project root..."
cp backend/target/release/xarth-mai-backend Xarth-Mai

echo "------------------------------------------------"
echo "✓ Build artifacts prepared in project root"
echo "  Contents:"
echo "    - Xarth-Mai (Executable)"
echo "    - dist/ (Static assets)"
echo "------------------------------------------------"
