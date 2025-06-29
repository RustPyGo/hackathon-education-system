# Sorted Response APIs - Implementation Summary

## Overview

Đã implement thành công các API để lấy responses được sort theo score (cao nhất trước) và time_spent (ưu tiên score trước).

## Các API Endpoints Mới

### 1. Get All Responses Sorted by Score

- **Endpoint:** `GET /api/v1/response/sorted/score`
- **Mô tả:** Lấy tất cả responses được sort theo score (cao nhất trước) và time_taken (nhanh nhất trước cho cùng score)

### 2. Get Responses by Project ID Sorted by Score

- **Endpoint:** `GET /api/v1/response/project/{projectId}/sorted/score`
- **Mô tả:** Lấy responses cho một project cụ thể được sort theo score

### 3. Get Responses by User ID Sorted by Score

- **Endpoint:** `GET /api/v1/response/user/{userId}/sorted/score`
- **Mô tả:** Lấy responses cho một user cụ thể được sort theo score

## Logic Sorting

```sql
ORDER BY score DESC, time_taken ASC
```

- **Primary sort:** Score giảm dần (điểm cao nhất trước)
- **Secondary sort:** Time taken tăng dần (thời gian nhanh nhất trước cho cùng score)

## Files Đã Thay Đổi

### 1. Repository Layer

- `backend/internal/repositories/response.repository.go`
  - Thêm 3 methods mới:
    - `GetAllSortedByScore()`
    - `GetByProjectIDSortedByScore(projectID string)`
    - `GetByUserIDSortedByScore(userID string)`

### 2. Service Layer

- `backend/internal/services/response.service.go`
  - Thêm 3 methods mới tương ứng với repository
  - Interface `IResponseService` được cập nhật

### 3. Controller Layer

- `backend/internal/controllers/response.controller.go`
  - Thêm 3 API endpoints mới với Swagger documentation
  - Validation và error handling đầy đủ

### 4. Router Layer

- `backend/internal/routers/response/response.router.go`
  - Thêm 3 routes mới cho sorted endpoints

## Testing

### Test Scripts

1. **`test_sorted_responses.sh`** - Test tất cả sorted response APIs
2. **`scripts/create_test_responses.sh`** - Tạo dữ liệu test với các score và time khác nhau

### Makefile Commands

```bash
# Test sorted response APIs
make test-sorted-responses

# Create test response data
make create-test-responses
```

## Documentation

- **`docs/sorted_response_apis.md`** - Documentation chi tiết cho các API mới
- **Swagger Documentation** - Tự động generate từ annotations trong controller

## Use Cases

1. **Leaderboards** - Hiển thị top performers cho project hoặc overall
2. **Performance Analysis** - So sánh performance của user qua các lần thi
3. **Competition Rankings** - Xếp hạng participants theo score và speed
4. **Progress Tracking** - Hiển thị best performances của user theo thời gian

## Example Response

```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": "uuid-1",
      "project_id": "project-uuid",
      "user_id": "user-uuid",
      "score": 95,
      "time_taken": 1200,
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-01T10:00:00Z"
    },
    {
      "id": "uuid-2",
      "project_id": "project-uuid",
      "user_id": "user-uuid",
      "score": 95,
      "time_taken": 1500,
      "created_at": "2024-01-01T11:00:00Z",
      "updated_at": "2024-01-01T11:00:00Z"
    }
  ]
}
```

## Cách Sử Dụng

### 1. Tạo Test Data

```bash
make create-test-responses
```

### 2. Test APIs

```bash
make test-sorted-responses
```

### 3. Manual Testing

```bash
# Get all responses sorted by score
curl -X GET "http://localhost:3000/api/v1/response/sorted/score"

# Get responses for project sorted by score
curl -X GET "http://localhost:3000/api/v1/response/project/project-1/sorted/score"

# Get responses for user sorted by score
curl -X GET "http://localhost:3000/api/v1/response/user/user-1/sorted/score"
```

## Validation

- ✅ Score được sort giảm dần (cao nhất trước)
- ✅ Time taken được sort tăng dần cho cùng score (nhanh nhất trước)
- ✅ Filtering theo project ID hoạt động đúng
- ✅ Filtering theo user ID hoạt động đúng
- ✅ Error handling đầy đủ
- ✅ Swagger documentation được generate
- ✅ Test scripts hoạt động
