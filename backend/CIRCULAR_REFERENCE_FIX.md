# Circular Reference Fix Documentation

## Problem Description

The backend was experiencing "Converting circular structure to JSON" errors when trying to serialize response objects. This happened because of circular references between related models:

### Circular References Found:

1. **Project ↔ Question**

   - `Project` has `Questions []Question`
   - `Question` has `Project Project`

2. **Project ↔ ChatMessage**

   - `Project` has `ChatMessages []ChatMessage`
   - `ChatMessage` has `Project Project`

3. **Project ↔ Response**

   - `Project` has `Responses []Response`
   - `Response` has `Project Project`

4. **Answer ↔ Multiple Models**
   - `Answer` has `Response Response`, `Question Question`, `Choice QuestionChoice`
   - These models have relationships back to `Answer`

## Solution Applied

### 1. Removed Circular References

**Question Model:**

```go
// Before
type Question struct {
    // ... other fields
    Project Project `json:"project,omitempty" gorm:"foreignKey:ProjectID"`
}

// After
type Question struct {
    // ... other fields
    // Relationships (removed Project to avoid circular reference)
}
```

**ChatMessage Model:**

```go
// Before
type ChatMessage struct {
    // ... other fields
    Project Project `json:"project,omitempty" gorm:"foreignKey:ProjectID"`
}

// After
type ChatMessage struct {
    // ... other fields
    // Relationships (removed Project to avoid circular reference)
}
```

**Response Model:**

```go
// Before
type Response struct {
    // ... other fields
    Project Project `json:"project,omitempty" gorm:"foreignKey:ProjectID"`
}

// After
type Response struct {
    // ... other fields
    // Relationships (removed Project to avoid circular reference)
}
```

**Answer Model:**

```go
// Before
type Answer struct {
    // ... other fields
    Response Response       `json:"response,omitempty" gorm:"foreignKey:ResponseID"`
    Question Question       `json:"question,omitempty" gorm:"foreignKey:QuestionID"`
    Choice   QuestionChoice `json:"choice,omitempty" gorm:"foreignKey:ChoiceID"`
}

// After
type Answer struct {
    // ... other fields
    // Relationships (removed to avoid circular references)
}
```

### 2. Kept Foreign Keys

All foreign key fields (`ProjectID`, `QuestionID`, etc.) are still present for database relationships, but the actual model references are removed to prevent circular JSON serialization.

## Benefits

1. **Fixed JSON Serialization**: No more circular reference errors
2. **Cleaner API Responses**: Responses contain only necessary data
3. **Better Performance**: No unnecessary data loading
4. **Maintainable Code**: Clear separation of concerns

## Best Practices for Future Development

### 1. Avoid Bidirectional Relationships in JSON

```go
// ❌ Bad - Creates circular reference
type Parent struct {
    ID     string   `json:"id"`
    Name   string   `json:"name"`
    Childs []Child  `json:"children"`
}

type Child struct {
    ID     string `json:"id"`
    Name   string `json:"name"`
    Parent Parent `json:"parent"` // This creates circular reference
}

// ✅ Good - One-way relationship
type Parent struct {
    ID     string   `json:"id"`
    Name   string   `json:"name"`
    Childs []Child  `json:"children"`
}

type Child struct {
    ID       string `json:"id"`
    Name     string `json:"name"`
    ParentID string `json:"parent_id"` // Only foreign key, no model reference
}
```

### 2. Use DTOs for Complex Responses

```go
// Create separate DTOs for API responses
type ProjectResponse struct {
    ID           string                `json:"id"`
    Name         string                `json:"name"`
    Summary      string                `json:"summary"`
    Questions    []QuestionResponse    `json:"questions,omitempty"`
    ChatMessages []ChatMessageResponse `json:"chat_messages,omitempty"`
}

type QuestionResponse struct {
    ID          string   `json:"id"`
    Content     string   `json:"content"`
    Type        string   `json:"type"`
    Difficulty  string   `json:"difficulty"`
    Choices     []Choice `json:"choices,omitempty"`
    // No Project field to avoid circular reference
}
```

### 3. Selective Loading

```go
// Only load relationships when needed
func (r *ProjectRepository) GetProjectWithQuestions(id string) (*models.Project, error) {
    var project models.Project
    err := r.db.Preload("Questions").First(&project, "id = ?", id).Error
    return &project, err
}

func (r *ProjectRepository) GetProjectBasic(id string) (*models.Project, error) {
    var project models.Project
    err := r.db.First(&project, "id = ?", id).Error
    return &project, err
}
```

### 4. Use JSON Tags Wisely

```go
type Model struct {
    ID        string         `json:"id"`
    Name      string         `json:"name"`
    CreatedAt time.Time      `json:"created_at"`
    UpdatedAt time.Time      `json:"updated_at"`
    DeletedAt gorm.DeletedAt `json:"-"` // Exclude from JSON
}
```

## Testing

Use the provided test script to verify the fix:

```bash
./test_circular_reference.sh
```

This script tests all endpoints that were previously causing circular reference errors.

## Migration Notes

- **Database Schema**: No changes needed, foreign keys remain intact
- **API Endpoints**: No changes needed, responses will be cleaner
- **Frontend**: May need to adjust if it was expecting nested relationship data
- **Queries**: Still work the same, just without circular references in JSON

## Related Files Modified

1. `internal/models/question.go` - Removed Project relationship
2. `internal/models/chat_message.go` - Removed Project relationship
3. `internal/models/response.go` - Removed Project relationship
4. `internal/models/answer.go` - Removed all relationships
5. `test_circular_reference.sh` - Test script for verification
