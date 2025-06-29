#!/bin/bash

# Load environment variables from .env file
if [ -f ../../.env ]; then
    export $(cat ../../.env | grep -v '^#' | xargs)
    echo "Environment variables loaded from .env file"
else
    echo "Warning: .env file not found. Using default values."
fi

# Run the application
go run cmd/server/main.go 