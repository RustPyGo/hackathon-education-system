# API Usage Guide - Project with PDF Processing

## Create Project with PDF Upload

### Endpoint

```
POST /api/v1/project/
```

### Content-Type

```
multipart/form-data
```

### Form Data

- `pdf` (file): PDF file to upload (required)
- `account_id` (string): Account ID (required)

### Example using curl

```bash
curl -X POST http://localhost:8080/api/v1/project/ \
  -F "pdf=@/path/to/your/document.pdf" \
  -F "account_id=user123"
```

### Example using JavaScript/Fetch

```javascript
const formData = new FormData();
formData.append("pdf", pdfFile); // pdfFile is a File object
formData.append("account_id", "user123");

fetch("http://localhost:8080/api/v1/project/", {
  method: "POST",
  body: formData,
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid-generated-id",
    "account_id": "user123",
    "pdf_path": "./uploads/uuid-generated-id_timestamp.pdf",
    "extracted": "Extracted text from PDF with proper formatting...",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Error Responses

#### Missing PDF file

```json
{
  "success": false,
  "message": "PDF file is required"
}
```

#### Invalid file type

```json
{
  "success": false,
  "message": "Only PDF files are allowed"
}
```

#### Missing account_id

```json
{
  "success": false,
  "message": "Account ID is required"
}
```

#### Processing error

```json
{
  "success": false,
  "message": "Failed to create project: [error details]"
}
```

## Features

1. **PDF File Upload**: Accepts PDF files via multipart form data
2. **File Validation**: Validates that uploaded file is a PDF
3. **Text Extraction**: Extracts text from PDF while preserving formatting
4. **File Storage**: Saves PDF files to `./uploads/` directory with unique names
5. **Database Storage**: Stores project info, PDF path, and extracted text in database

## File Structure

- PDF files are saved to: `./uploads/{project_id}_{timestamp}.pdf`
- Extracted text is stored in the `extracted` field of the Project model
- PDF path is stored in the `pdf_path` field of the Project model

## Dependencies

- `github.com/ledongthuc/pdf`: For PDF text extraction (open source, no license required)
- `github.com/gin-gonic/gin`: For HTTP routing and file handling
- `gorm.io/gorm`: For database operations

## PDF Processing

The system uses `github.com/ledongthuc/pdf` package which:

- ✅ **No License Required**: Open source package
- ✅ **Format Preservation**: Maintains text formatting and line breaks
- ✅ **Multi-page Support**: Handles PDFs with multiple pages
- ✅ **Error Handling**: Robust error handling for corrupted or invalid PDFs
- ✅ **Performance**: Efficient text extraction
