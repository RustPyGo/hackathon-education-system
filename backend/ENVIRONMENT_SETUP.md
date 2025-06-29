# Environment Configuration Setup

Backend đã được refactor để sử dụng environment variables thay vì file `local.yaml`.

## Cấu trúc mới

### 1. File `.env`

Chứa tất cả environment variables cần thiết:

```bash
# Database Configuration
PG_USER=macbook
PG_PASS=postgres
PG_DB=education_system

# Server Configuration
SERVER_PORT=3000
SERVER_MODE=debug

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# AWS/S3 Configuration
AWS_REGION=hcm
AWS_BUCKET=prj301
AWS_ACCESS_KEY=your-access-key
AWS_SECRET_KEY=your-secret-key
AWS_ENDPOINT=https://hcm.ss.bfcplatform.vn

# Registry Configuration
REGISTRY=your-registry
```

### 2. File `compose.yaml`

Đã được cập nhật để sử dụng environment variables:

```yaml
backend:
  env_file:
    - .env
  environment:
    DATABASE_HOST: database
    DATABASE_PORT: 5432
    DATABASE_USER: ${PG_USER}
    DATABASE_PASSWORD: ${PG_PASS}
    DATABASE_NAME: ${PG_DB}
    # ... other environment variables
```

## Cách sử dụng

### Development Mode

1. **Sử dụng script load-env.sh**:

```bash
cd backend
make run
```

2. **Chạy trực tiếp**:

```bash
cd backend
go run cmd/server/main.go
```

### Docker Mode

1. **Build và run với Docker**:

```bash
cd backend
make docker-build
make docker-run
```

2. **Sử dụng Docker Compose**:

```bash
# Từ thư mục root
docker-compose --profile backend up -d

# Hoặc từ backend directory
make compose-up
```

### Environment Variables

| Variable         | Description                 | Default            |
| ---------------- | --------------------------- | ------------------ |
| `PG_USER`        | PostgreSQL username         | `postgres`         |
| `PG_PASS`        | PostgreSQL password         | `postgres`         |
| `PG_DB`          | PostgreSQL database name    | `education_system` |
| `SERVER_PORT`    | Server port                 | `3000`             |
| `SERVER_MODE`    | Server mode (debug/release) | `debug`            |
| `REDIS_HOST`     | Redis host                  | `localhost`        |
| `REDIS_PORT`     | Redis port                  | `6379`             |
| `REDIS_PASSWORD` | Redis password              | ``                 |
| `REDIS_DB`       | Redis database              | `0`                |
| `AWS_REGION`     | AWS region                  | `us-east-1`        |
| `AWS_BUCKET`     | S3 bucket name              | ``                 |
| `AWS_ACCESS_KEY` | AWS access key              | ``                 |
| `AWS_SECRET_KEY` | AWS secret key              | ``                 |
| `AWS_ENDPOINT`   | Custom S3 endpoint          | ``                 |

## Migration từ local.yaml

### Trước (local.yaml):

```yaml
server:
  port: 3000
  mode: debug

database:
  host: localhost
  port: 5432
  user: macbook
  password: postgres
  dbname: education_system
  sslmode: disable
```

### Sau (.env):

```bash
SERVER_PORT=3000
SERVER_MODE=debug
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=macbook
DATABASE_PASSWORD=postgres
DATABASE_NAME=education_system
DATABASE_SSLMODE=disable
```

## Lợi ích

1. **Security**: Environment variables không được commit vào git
2. **Flexibility**: Dễ dàng thay đổi config cho từng environment
3. **Docker Integration**: Tích hợp tốt với Docker và Docker Compose
4. **CI/CD**: Dễ dàng sử dụng trong CI/CD pipelines
5. **12-Factor App**: Tuân thủ nguyên tắc 12-factor app

## Troubleshooting

### Lỗi "Environment variables not found"

- Kiểm tra file `.env` có tồn tại không
- Đảm bảo file `.env` ở thư mục root của project

### Lỗi "Database connection failed"

- Kiểm tra các biến `DATABASE_*` trong `.env`
- Đảm bảo PostgreSQL đang chạy

### Lỗi "Redis connection failed"

- Kiểm tra các biến `REDIS_*` trong `.env`
- Đảm bảo Redis đang chạy
