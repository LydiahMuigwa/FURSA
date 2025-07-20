#!/bin/bash
# Development startup script

echo 'Starting ZIVU development environment...'

# Start backend
cd backend
npm run dev &
BACKEND_PID=$!

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo 'Backend running on http://localhost:5000'
echo 'Frontend running on http://localhost:5173'
echo 'Press Ctrl+C to stop both servers'

# Wait for Ctrl+C
trap 'kill $BACKEND_PID $FRONTEND_PID' INT
wait
