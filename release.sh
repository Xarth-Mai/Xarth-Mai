#!/bin/bash

# Exit on error
set -e

echo "==> Cleaning up old builds..."
rm -rf dist Xarth-Mai release Xarth-Mai-release.tar.gz

echo "==> Building frontend..."
cd frontend
bun install
bun run build
cd ..

echo "==> Building backend..."
cd backend
cargo build --release
cd ..

echo "==> Preparing release package..."
mkdir -p release
cp backend/target/release/xarth-mai-backend release/Xarth-Mai
cp -r dist release/dist

echo "==> Creating compressed archive..."
tar -czvf Xarth-Mai-release.tar.gz -C release .

echo "==> Cleaning up temporary files..."
rm -rf release

echo "------------------------------------------------"
echo "✓ Release package created: Xarth-Mai-release.tar.gz"
echo "  Contents:"
echo "    - Xarth-Mai (Executable)"
echo "    - dist/ (Static assets)"
echo "------------------------------------------------"
