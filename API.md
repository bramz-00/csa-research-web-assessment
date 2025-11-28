# API Documentation

Base URL: `http://localhost:8000`

## Table of Contents
- [Authentication](#authentication)
  - [Login](#login)
  - [Logout](#logout)
  - [Register](#register)
- [Users](#users)
  - [List Users](#list-users)
  - [Get User](#get-user)
  - [Create User](#create-user)
  - [Update User](#update-user)
  - [Delete User](#delete-user)
- [File Upload](#file-upload)
  - [Upload File](#upload-file)
- [CSRF Token](#csrf-token)
- [Error Responses](#error-responses)

---

## Authentication

### Login

Authenticate a user and create a session.

**Endpoint:** `POST /api/auth/login.php`

**Headers:**
```
Content-Type: application/json
X-CSRF-Token: {csrf_token}
```

**Request Body:**
```json
{
  "email": "superadmin@example.com",
  "password": "password"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Super Admin",
    "email": "superadmin@example.com",
    "is_active": 1,
    "created_at": "2025-11-28 10:00:00"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/auth/login.php \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your_csrf_token" \
  -d '{
    "email": "superadmin@example.com",
    "password": "password"
  }'
```

---

### Logout

Destroy the current user session.

**Endpoint:** `GET /api/auth/logout.php`

**Authentication:** Required (Session)

**Success Response (200 OK):**
```json
{
  "success": true
}
```

**Example:**
```bash
curl -X GET http://localhost:8000/api/auth/logout.php \
  --cookie "PHPSESSID=your_session_id"
```

---

### Register

Create a new user account and automatically log them in.

**Endpoint:** `POST /api/auth/register.php`

**Headers:**
```
Content-Type: application/json
X-CSRF-Token: {csrf_token}
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "id": 5,
  "user": {
    "id": 5,
    "name": "John Doe",
    "email": "john@example.com",
    "is_active": 1,
    "created_at": "2025-11-28 23:45:00"
  },
  "message": "Registration successful. You are now logged in."
}
```

**Error Response (422 Unprocessable Entity):**
```json
{
  "error": "Missing fields"
}
```

**Error Response (409 Conflict):**
```json
{
  "error": "Email already exists"
}
```

**Error Response (403 Forbidden):**
```json
{
  "error": "Invalid CSRF token"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/auth/register.php \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your_csrf_token" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

**Note:** After successful registration, the user is automatically logged in and a session is created.

---

## Users

### List Users

Retrieve a list of all users.

**Endpoint:** `GET /api/users/list.php`

**Authentication:** Required (Session)

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Super Admin",
    "email": "superadmin@example.com",
    "is_active": 1,
    "created_at": "2025-11-28 10:00:00"
  },
  {
    "id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "is_active": 1,
    "created_at": "2025-11-28 11:00:00"
  }
]
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized"
}
```

**Example:**
```bash
curl -X GET http://localhost:8000/api/users/list.php \
  --cookie "PHPSESSID=your_session_id"
```

---

### Get User

Retrieve a specific user by ID.

**Endpoint:** `GET /api/users/get_user.php?id={id}`

**Authentication:** Required (Session)

**URL Parameters:**
- `id` (integer, required) - User ID

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Super Admin",
  "email": "superadmin@example.com",
  "is_active": 1,
  "created_at": "2025-11-28 10:00:00"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing id"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "User not found"
}
```

**Example:**
```bash
curl -X GET "http://localhost:8000/api/users/get_user.php?id=1" \
  --cookie "PHPSESSID=your_session_id"
```

---

### Create User

Create a new user account.

**Endpoint:** `POST /api/users/create.php`

**Headers:**
```
Content-Type: application/json
X-CSRF-Token: {csrf_token}
```

**Request Body:**
```json
{
  "name": "Bel3id",
  "email": "superaeazeadmin@example.com",
  "password": "password"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "id": 3
}
```

**Error Response (422 Unprocessable Entity):**
```json
{
  "error": "Missing fields"
}
```

**Error Response (409 Conflict):**
```json
{
  "error": "Email already exists"
}
```

**Error Response (403 Forbidden):**
```json
{
  "error": "Invalid CSRF token"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/users/create.php \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your_csrf_token" \
  -d '{
    "name": "Bel3id",
    "email": "superaeazeadmin@example.com",
    "password": "password"
  }'
```

---

### Update User

Update an existing user's information.

**Endpoint:** `POST /api/users/update.php/{id}`

**Authentication:** Required (Session)

**Headers:**
```
Content-Type: application/json
```

**URL Parameters:**
- `id` (integer, required) - User ID in the URL path

**Request Body:**
```json
{
  "name": "Kylian Mbappé",
  "email": "kylian@psg.fr"
}
```

**Note:** Password field is optional. If not provided, the password will not be updated.

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "updated_id": 1
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Valid ID required in URL"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized"
}
```

**Error Response (422 Unprocessable Entity):**
```json
{
  "error": "No data sent for update"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/users/update.php/1 \
  -H "Content-Type: application/json" \
  --cookie "PHPSESSID=your_session_id" \
  -d '{
    "name": "Kylian Mbappé",
    "email": "kylian@psg.fr"
  }'
```

---

### Delete User

Delete a user account.

**Endpoint:** `POST /api/users/delete.php`

**Authentication:** Required (Session)

**Headers:**
```
Content-Type: application/json
X-CSRF-Token: {csrf_token}
```

**Request Body:**
```json
{
  "id": 3
}
```

**Success Response (200 OK):**
```json
{
  "success": true
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized"
}
```

**Error Response (403 Forbidden):**
```json
{
  "error": "Invalid CSRF token"
}
```

**Error Response (422 Unprocessable Entity):**
```json
{
  "error": "Missing id"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/users/delete.php \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your_csrf_token" \
  --cookie "PHPSESSID=your_session_id" \
  -d '{
    "id": 3
  }'
```

---

## File Upload

### Upload File

Upload a file (JPEG, PNG, or PDF) to the server.

**Endpoint:** `POST /api/users/upload.php`

**Headers:**
```
Content-Type: multipart/form-data
X-CSRF-Token: {csrf_token}
```

**Request Body:**
- Form data with a `file` field containing the file to upload

**Allowed File Types:**
- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- PDF (`.pdf`)

**Maximum File Size:** 5 MB

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "filename": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.jpg",
  "size": 245678,
  "type": "image/jpeg"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "File too large. Maximum allowed: 5 MB"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid file type. Allowed: JPEG, PNG, PDF"
}
```

**Error Response (403 Forbidden):**
```json
{
  "error": "Invalid or missing CSRF token"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Server error during upload. Please try again."
}
```

**Example (cURL):**
```bash
# Get CSRF token first
TOKEN=$(curl -s http://localhost:8000/server/utils/get_csrf.php | jq -r '.token')

# Upload file
curl -X POST http://localhost:8000/api/users/upload.php \
  -H "X-CSRF-Token: $TOKEN" \
  -F "file=@/path/to/your/file.jpg"
```

**Example (JavaScript):**
```javascript
// Get CSRF token
const tokenRes = await fetch('/server/utils/get_csrf.php');
const { token } = await tokenRes.json();

// Prepare form data
const formData = new FormData();
formData.append('file', fileInput.files[0]);

// Upload
const res = await fetch('/api/users/upload.php', {
    method: 'POST',
    headers: { 'X-CSRF-Token': token },
    body: formData
});

const json = await res.json();
console.log(json);
```

**Upload Location:**
- Files are stored in `/uploads/` directory at project root
- Filenames are randomly generated for security (32 hex characters + extension)
- Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.jpg`

**Security Features:**
- CSRF token protection
- MIME type validation using `finfo`
- File size limit (5 MB)
- Random filename generation
- Secure file type whitelist
- Comprehensive error handling

**UI Page:**
- Visit `/client/upload.html` for a user-friendly upload interface

---

## CSRF Token

### Get CSRF Token

Retrieve a CSRF token for form submissions.

**Endpoint:** `GET /server/utils/get_csrf.php`

**Success Response (200 OK):**
```json
{
  "token": "a1b2c3d4e5f6g7h8i9j0"
}
```

**Example:**
```bash
curl -X GET http://localhost:8000/server/utils/get_csrf.php
```

**Note:** CSRF tokens are required for:
- Login
- Create User
- Update User (when using CSRF protection)
- Delete User

---

## Error Responses

### Common HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Not logged in |
| 403 | Forbidden - Invalid CSRF token |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Missing required fields |

### Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

---

## Authentication Flow

1. **Get CSRF Token:**
   ```
   GET /server/utils/get_csrf.php
   ```

2. **Login:**
   ```
   POST /api/auth/login.php
   Headers: X-CSRF-Token
   Body: { email, password }
   ```

3. **Store Session Cookie:**
   The server will set a `PHPSESSID` cookie that must be included in subsequent requests.

4. **Make Authenticated Requests:**
   Include the session cookie in all requests to protected endpoints.

5. **Logout:**
   ```
   GET /api/auth/logout.php
   ```

---

## Testing with Postman

### Setup

1. **Import Environment Variables:**
   - `base_url`: `http://localhost:8000`
   - `csrf_token`: (will be set automatically)
   - `session_cookie`: (will be set automatically)

### Test Sequence

1. **Get CSRF Token**
   - GET `{{base_url}}/server/utils/get_csrf.php`
   - Save `token` to `csrf_token` variable

2. **Login**
   - POST `{{base_url}}/api/auth/login.php`
   - Headers: `X-CSRF-Token: {{csrf_token}}`
   - Body: `{ "email": "superadmin@example.com", "password": "password" }`

3. **List Users**
   - GET `{{base_url}}/api/users/list.php`

4. **Create User**
   - POST `{{base_url}}/api/users/create.php`
   - Headers: `X-CSRF-Token: {{csrf_token}}`
   - Body: `{ "name": "Test User", "email": "test@example.com", "password": "password" }`

5. **Update User**
   - POST `{{base_url}}/api/users/update.php/1`
   - Body: `{ "name": "Updated Name", "email": "updated@example.com" }`

6. **Delete User**
   - POST `{{base_url}}/api/users/delete.php`
   - Headers: `X-CSRF-Token: {{csrf_token}}`
   - Body: `{ "id": 3 }`

7. **Logout**
   - GET `{{base_url}}/api/auth/logout.php`

---

## Notes

- All endpoints return JSON responses
- Session-based authentication is used (cookies)
- CSRF protection is implemented for state-changing operations
- Passwords are hashed using bcrypt
- All timestamps are in `YYYY-MM-DD HH:MM:SS` format
