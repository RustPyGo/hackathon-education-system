# CORS Setup Documentation

## Overview

Cross-Origin Resource Sharing (CORS) has been configured for the backend to allow frontend applications to make API requests from different origins.

## Configuration

### 1. CORS Middleware

The CORS middleware is configured in `internal/middleware/cors.go` with three different configurations:

#### Development Mode (`DevelopmentCORSMiddleware`)

```go
- AllowOrigins: ["*"] (all origins)
- AllowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]
- AllowHeaders: ["*"] (all headers)
- AllowCredentials: false
- MaxAge: 12 hours
```

#### Production Mode (`CORSMiddleware`)

```go
- AllowOrigins: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "http://127.0.0.1:3000"]
- AllowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]
- AllowHeaders: ["Origin", "Content-Length", "Content-Type", "Authorization", "X-Requested-With", "Accept", "X-API-Key"]
- AllowCredentials: true
- MaxAge: 12 hours
```

#### Strict Production Mode (`ProductionCORSMiddleware`)

```go
- AllowOrigins: ["https://yourdomain.com", "https://www.yourdomain.com"]
- AllowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]
- AllowHeaders: ["Origin", "Content-Length", "Content-Type", "Authorization", "X-Requested-With", "Accept"]
- AllowCredentials: true
- MaxAge: 12 hours
```

### 2. Environment Configuration

CORS settings can be configured via environment variables in `.env`:

```env
# CORS Configuration
CORS_ALLOW_ORIGINS=http://localhost:3000,http://localhost:5173
CORS_ALLOW_METHODS=GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS
CORS_ALLOW_HEADERS=Origin,Content-Length,Content-Type,Authorization,X-Requested-With,Accept,X-API-Key
CORS_EXPOSE_HEADERS=Content-Length,Content-Type,Authorization
CORS_ALLOW_CREDENTIALS=true
CORS_MAX_AGE=43200
```

### 3. Router Integration

CORS middleware is applied in `internal/initialize/router.go`:

```go
// Add CORS middleware first (before other middleware)
if global.Config.Server.Mode == "dev" {
    r.Use(middleware.DevelopmentCORSMiddleware())
} else {
    r.Use(middleware.CORSMiddleware())
}
```

## Allowed Origins

### Development

- `http://localhost:3000` (Next.js default)
- `http://localhost:5173` (Vite default)
- `http://127.0.0.1:5173` (Vite alternative)
- `http://127.0.0.1:3000` (Next.js alternative)

### Production

- `https://yourdomain.com` (replace with your actual domain)
- `https://www.yourdomain.com` (replace with your actual domain)

## Allowed Methods

- `GET` - Retrieve data
- `POST` - Create new resources
- `PUT` - Update existing resources
- `PATCH` - Partial updates
- `DELETE` - Remove resources
- `HEAD` - Get headers only
- `OPTIONS` - Preflight requests

## Allowed Headers

- `Origin` - Request origin
- `Content-Length` - Request body size
- `Content-Type` - Request content type
- `Authorization` - Authentication tokens
- `X-Requested-With` - AJAX requests
- `Accept` - Acceptable response types
- `X-API-Key` - API key authentication

## Exposed Headers

- `Content-Length` - Response body size
- `Content-Type` - Response content type
- `Authorization` - Authentication headers

## Testing CORS

Use the provided test script to verify CORS configuration:

```bash
./test_cors.sh
```

This script tests:

1. CORS preflight requests (OPTIONS)
2. Actual GET requests with CORS headers
3. POST requests with CORS headers
4. Requests from unauthorized origins
5. Server status endpoint

## Frontend Integration

### JavaScript/Fetch API

```javascript
fetch("http://localhost:3000/api/v1/project", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer your-token",
  },
  credentials: "include", // if using cookies
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Axios

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // if using cookies
  headers: {
    "Content-Type": "application/json",
  },
});

api.get("/project").then((response) => console.log(response.data));
```

## Security Considerations

### 1. Origin Validation

- Only allow trusted origins in production
- Never use `*` for `AllowOrigins` in production
- Validate origins against a whitelist

### 2. Credentials

- Set `AllowCredentials: false` when using `AllowOrigins: ["*"]`
- Only enable credentials for trusted origins

### 3. Headers

- Only expose necessary headers
- Be specific about allowed headers
- Avoid using `*` for `AllowHeaders` in production

### 4. Methods

- Only allow necessary HTTP methods
- Restrict dangerous methods like DELETE in public APIs

## Troubleshooting

### Common CORS Errors

1. **"No 'Access-Control-Allow-Origin' header"**

   - Check if origin is in allowed list
   - Verify CORS middleware is applied

2. **"Method not allowed"**

   - Check if HTTP method is in allowed list
   - Verify preflight request handling

3. **"Headers not allowed"**

   - Check if custom headers are in allowed list
   - Verify `Access-Control-Request-Headers` in preflight

4. **"Credentials not supported"**
   - Set `AllowCredentials: true`
   - Ensure origin is not `*` when using credentials

### Debug Steps

1. Check server logs for CORS-related errors
2. Use browser developer tools to inspect CORS headers
3. Test with curl to isolate frontend vs backend issues
4. Verify environment variables are loaded correctly

## Production Deployment

### 1. Update Allowed Origins

```go
// In ProductionCORSMiddleware
AllowOrigins: []string{"https://yourdomain.com", "https://www.yourdomain.com"}
```

### 2. Environment Variables

```env
SERVER_MODE=production
CORS_ALLOW_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
CORS_ALLOW_CREDENTIALS=true
```

### 3. Security Headers

Consider adding additional security headers:

- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`
- `Strict-Transport-Security`

## Related Files

1. `internal/middleware/cors.go` - CORS middleware implementation
2. `internal/initialize/router.go` - Router configuration
3. `pkg/setting/section.go` - CORS configuration structure
4. `internal/initialize/loadconfig.go` - Configuration loading
5. `test_cors.sh` - CORS testing script
