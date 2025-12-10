#!/bin/bash
git checkout -- .
git pull
cd frontend
bun install
bun run build
cd ..
go build .
systemctl restart Xarth-Mai