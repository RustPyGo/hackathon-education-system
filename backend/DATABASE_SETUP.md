# Database Setup Guide

## PostgreSQL Setup

### 1. Install PostgreSQL

#### macOS (using Homebrew):

```bash
brew install postgresql
brew services start postgresql
```

#### Ubuntu/Debian:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows:

Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Connect to PostgreSQL as postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE education_system;

# Create user (optional)
CREATE USER education_user WITH PASSWORD 'password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE education_system TO education_user;

# Exit
\q
```

### 3. Update Configuration

Edit `configs/local.yaml`:

```yaml
database:
  driver: "postgres"
  host: "localhost"
  port: 5432
  username: "postgres" # or your username
  password: "password" # your password
  dbname: "education_system"
  sslmode: "disable"
  max_idle_conns: 10
  max_open_conns: 100
```

### 4. Run the Application

```bash
# Build and run
go run ./cmd/server/main.go

# Or using make
make run

# Or using air for hot reload
air
```

### 5. Database Migrations

The application will automatically create tables when it starts:

- `users` table with fields:
  - `id` (primary key)
  - `name` (varchar 255, not null)
  - `email` (varchar 255, unique, not null)
  - `password` (varchar 255, not null, hashed)
  - `avatar` (varchar 500)
  - `role` (varchar 50, default 'user')
  - `is_email_verified` (boolean, default false)
  - `last_login_at` (timestamp)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
  - `deleted_at` (timestamp, soft delete)

### 6. API Endpoints

#### Register User

```bash
POST /api/v1/user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User

```bash
POST /api/v1/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile

```bash
GET /api/v1/user/profile?user_id=1
```

### 7. Response Format

All responses follow this format:

```json
{
  "code": 20001,
  "message": "success",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### 8. Error Codes

- `20001`: Success
- `20003`: Parameter invalid
- `20004`: User already exists

### 9. Troubleshooting

#### Connection Issues:

1. Check if PostgreSQL is running
2. Verify connection details in config
3. Check firewall settings
4. Ensure database exists

#### Migration Issues:

1. Check database permissions
2. Verify table doesn't already exist
3. Check GORM logs for detailed errors

#### Build Issues:

1. Run `go mod tidy`
2. Ensure all dependencies are installed
3. Check Go version compatibility
