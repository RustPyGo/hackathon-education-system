.PHONY: swagger build run clean test dev docker-build docker-run compose-up compose-down compose-logs

# Generate Swagger documentation
swagger:
	swag init -g cmd/server/main.go -o docs

# Build the application
build:
	go build -o bin/server cmd/server/main.go

# Run the server with environment variables
run:
	./scripts/load-env.sh

# Run the server directly (without loading .env)
run-direct:
	go run cmd/server/main.go

# Clean build artifacts
clean:
	rm -rf bin/
	rm -rf docs/docs.go
	rm -rf docs/swagger.json
	rm -rf docs/swagger.yaml

# Run tests
test:
	go test ./...

# Test sorted response APIs
test-sorted-responses:
	./test_sorted_responses.sh

# Create test response data
create-test-responses:
	./scripts/create_test_responses.sh

# Install dependencies
deps:
	go mod tidy
	go mod download

# Full setup (install deps, generate swagger, build)
setup: deps swagger build

# Development mode (generate swagger and run with env)
dev: swagger run

# Docker commands
docker-build:
	docker build -t education-system-backend .

docker-run:
	docker run --env-file ../.env -p 3000:3000 education-system-backend

# Docker compose commands
compose-up:
	docker-compose -f ../compose.yaml --profile backend up -d

compose-down:
	docker-compose -f ../compose.yaml down

compose-logs:
	docker-compose -f ../compose.yaml logs -f backend