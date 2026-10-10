# Next.js ↔ FastAPI Login Integration

This document outlines the complete login flow implementation connecting the Next.js frontend with the FastAPI backend.

## Overview

The login system has been successfully integrated to:
- Accept POST requests to `/api/login` endpoint
- Generate JWT tokens for authenticated users
- Store tokens in localStorage
- Redirect to Dashboard on successful login
- Handle and display error messages

## Backend (FastAPI)

### Files Created/Modified

1. **`backend/app/routers/auth.py`** (NEW)
   - Implements `POST /api/login` endpoint
   - Validates email and password
   - Generates JWT access tokens
   - Returns user info with token

2. **`backend/app/schemas/auth.py`** (NEW)
   - `LoginRequest`: Email and password validation
   - `LoginResponse`: Token and user data structure

3. **`backend/app/main.py`** (MODIFIED)
   - Includes auth router
   - CORS already configured for all origins

### Login Endpoint Details

**Request:**
```json
POST /api/login
Content-Type: application/json

{
  "email": "demo@openrouter.com",
  "password": "password"
}
```

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "email": "demo@openrouter.com",
    "name": "demo"
  }
}
```

**Error Response (401):**
```json
{
  "detail": "Invalid email or password"
}
```

**Error Response (422):**
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "invalid email format",
      "type": "value_error.email"
    }
  ]
}
```

## Frontend (Next.js)

### Files Created/Modified

1. **`frontend/lib/api.ts`** (NEW)
   - API client with `login()` method
   - Uses `fetch` for HTTP requests
   - Handles response validation and error messages

2. **`frontend/app/auth/login/page.tsx`** (MODIFIED)
   - Calls `apiClient.login()` instead of mock auth
   - Stores JWT using `setToken()`
   - Displays server error messages
   - Redirects to `/dashboard` on success

3. **`frontend/.env.local`** (NEW)
   - `NEXT_PUBLIC_API_URL`: Backend URL (default: http://localhost:8000)

### Token Management

Tokens are stored in localStorage using:
```typescript
setToken(response.access_token);  // Save
getToken();                        // Retrieve
removeToken();                     // Clear
isAuthenticated();                 // Check
```

## Error Handling

The frontend handles multiple error scenarios:

| Status | Error | Display |
|--------|-------|---------|
| 401 | Invalid credentials | "البريد الإلكتروني أو كلمة السر غير صحيحة" |
| 422 | Invalid email format | Validation message from backend |
| Network | Fetch error | "حدث خطأ أثناء تسجيل الدخول" |

## Testing the Integration

### Prerequisites
- Backend running: `cd backend && uvicorn app.main:app --reload`
- Frontend running: `cd frontend && npm run dev`
- Frontend API URL configured in `.env.local`

### Test Flow
1. Navigate to `http://localhost:3000/auth/login`
2. Enter credentials:
   - Email: `demo@openrouter.com`
   - Password: `password`
3. Click "تسجيل الدخول"
4. Should redirect to `/dashboard`
5. Token stored in localStorage

### Test Errors
1. Invalid email format: Shows validation error
2. Wrong password: Shows "البريد الإلكتروني أو كلمة السر غير صحيحة"
3. Backend offline: Shows "حدث خطأ أثناء تسجيل الدخول"

## Production Considerations

### Security
- [ ] Move `SECRET_KEY` to environment variable
- [ ] Use HTTPOnly cookies instead of localStorage
- [ ] Add password hashing (bcrypt)
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Validate JWT signature on protected routes

### Backend
- [ ] Connect to real database
- [ ] Implement user registration
- [ ] Add password reset flow
- [ ] Add refresh token mechanism
- [ ] Implement JWT expiration checks

### Frontend
- [ ] Add JWT token to API requests (Authorization header)
- [ ] Implement middleware to redirect unauthenticated users
- [ ] Add logout functionality
- [ ] Handle token expiration

## Dependencies

### Backend
- fastapi
- pydantic
- pydantic[email]
- python-jose (for JWT)
- python-multipart

### Frontend
- next
- react

## Next Steps

1. Add protected API routes that verify JWT tokens
2. Create middleware to protect dashboard route
3. Add logout functionality
4. Implement user registration endpoint
5. Add password reset flow
