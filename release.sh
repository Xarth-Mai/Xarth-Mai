#!/bin/bash
git checkout -- .
git pull
cd frontend
bun install
bun run build
cd ../backend
go build -o ../Xarth-Mai .
systemctl restart Xarth-Mai