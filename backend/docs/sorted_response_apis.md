# Sorted Response APIs

## Overview

The sorted response APIs provide endpoints to retrieve responses ordered by score (highest first) and time taken (fastest first for same score). This is useful for leaderboards, rankings, and performance analysis.

## API Endpoints

### 1. Get All Responses Sorted by Score

**Endpoint:** `GET /api/v1/response/sorted/score`

**Description:** Get all responses sorted by score (highest first) and time taken (fastest first for same score).

**Response:**

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

### 2. Get Responses by Project ID Sorted by Score

**Endpoint:** `GET /api/v1/response/project/{projectId}/sorted/score`

**Description:** Get responses for a specific project sorted by score (highest first) and time taken (fastest first for same score).

**Parameters:**

- `projectId` (path): The project ID

**Response:** Same structure as above, but filtered by project.

### 3. Get Responses by User ID Sorted by Score

**Endpoint:** `GET /api/v1/response/user/{userId}/sorted/score`

**Description:** Get responses for a specific user sorted by score (highest first) and time taken (fastest first for same score).

**Parameters:**

- `userId` (path): The user ID

**Response:** Same structure as above, but filtered by user.

## Sorting Logic

The sorting is implemented using SQL `ORDER BY` clause:

```sql
ORDER BY score DESC, time_taken ASC
```

This means:

1. **Primary sort:** Score in descending order (highest score first)
2. **Secondary sort:** Time taken in ascending order (fastest time first for same score)

## Use Cases

1. **Leaderboards:** Display top performers for a project or overall
2. **Performance Analysis:** Compare user performance across different attempts
3. **Competition Rankings:** Rank participants by score and speed
4. **Progress Tracking:** Show user's best performances over time

## Example Usage

### Frontend Integration

```javascript
// Get top performers for a project
const getTopPerformers = async (projectId) => {
  const response = await fetch(
    `/api/v1/response/project/${projectId}/sorted/score`
  );
  const data = await response.json();
  return data.data; // Array of responses sorted by score
};

// Get user's best performances
const getUserBestScores = async (userId) => {
  const response = await fetch(`/api/v1/response/user/${userId}/sorted/score`);
  const data = await response.json();
  return data.data; // Array of user's responses sorted by score
};
```

### cURL Examples

```bash
# Get all responses sorted by score
curl -X GET "http://localhost:3000/api/v1/response/sorted/score" \
  -H "Content-Type: application/json"

# Get responses for a specific project sorted by score
curl -X GET "http://localhost:3000/api/v1/response/project/project-uuid/sorted/score" \
  -H "Content-Type: application/json"

# Get responses for a specific user sorted by score
curl -X GET "http://localhost:3000/api/v1/response/user/user-uuid/sorted/score" \
  -H "Content-Type: application/json"
```

## Error Handling

All endpoints return standard error responses:

```json
{
  "code": 400,
  "message": "Project ID is required"
}
```

Common error codes:

- `400`: Bad Request (missing parameters)
- `500`: Internal Server Error (database errors)

## Testing

Use the provided test script to verify the APIs:

```bash
./test_sorted_responses.sh
```

This script tests all sorted response endpoints and compares them with regular endpoints to ensure proper sorting behavior.
