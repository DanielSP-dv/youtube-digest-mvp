#!/usr/bin/env bash
set -e
trap 'kill 0' EXIT
node server.js &
cd client && npm start &
wait
