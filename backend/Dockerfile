FROM golang:1.24-alpine AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o ./main ./cmd/server/main.go

FROM alpine:edge

WORKDIR /app

COPY --from=build /app/main .

RUN apk --no-cache add ca-certificates tzdata

ENTRYPOINT ["/app/main"]
