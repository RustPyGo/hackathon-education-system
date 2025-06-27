# Education System Backend

## Cấu trúc dự án

```
backend/
├── cmd/                    # Entry point của ứng dụng
├── configs/                # Cấu hình ứng dụng
│   └── local.yaml         # Cấu hình local environment
├── global/                 # Global variables
├── internal/               # Internal packages
│   ├── controllers/        # HTTP controllers
│   ├── initialize/         # Khởi tạo các services
│   ├── models/            # Database models
│   ├── repositories/      # Data access layer
│   ├── routers/           # Route definitions
│   └── services/          # Business logic layer
├── pkg/                   # Public packages
│   ├── logger/            # Logging utilities
│   ├── response/          # HTTP response utilities
│   └── setting/           # Configuration structures
└── go.mod                 # Go modules
```

## Cài đặt và chạy

### 1. Cài đặt dependencies

```bash
go mod tidy
```

### 2. Cấu hình database

Chỉnh sửa file `configs/local.yaml`:

```yaml
database:
  host: localhost
  port: 5433
  user: postgres
  password: postgres
  dbname: education_system
  sslmode: disable
```

### 3. Chạy PostgreSQL với Docker

```bash
docker-compose up database -d
```

### 4. Chạy ứng dụng

```bash
go run cmd/main.go
```

## API Endpoints

### User Management

#### Tạo user mới

```http
POST /api/v1/user/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "user"
}
```

#### Lấy tất cả users

```http
GET /api/v1/user/
```

#### Lấy user theo ID

```http
GET /api/v1/user/{id}
```

#### Cập nhật user

```http
PUT /api/v1/user/{id}
Content-Type: application/json

{
  "email": "updated@example.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "role": "admin"
}
```

#### Xóa user

```http
DELETE /api/v1/user/{id}
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);
```

## Cấu trúc Repository Pattern

- **Models**: Định nghĩa cấu trúc dữ liệu
- **Repositories**: Xử lý truy cập database
- **Services**: Chứa business logic
- **Controllers**: Xử lý HTTP requests/responses

## Ghi chú

- Database sẽ được tự động migrate khi khởi động ứng dụng
- Tất cả responses đều theo format chuẩn với code, message và data
- Logging được cấu hình với Zap logger
- Redis được sử dụng cho caching (có thể mở rộng sau)
