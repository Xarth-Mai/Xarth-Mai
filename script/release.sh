#!/bin/bash
git checkout -- .
git pull
go build .
systemctl restart Xarth-Mai 