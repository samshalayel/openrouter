# Authentication API Documentation

This API implements JWT-based authentication with three endpoints for user registration, login, and profile retrieval.

## Endpoints

### 1. POST /api/auth/register

Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or invalid input
- `409 Conflict`: User with this email already exists
- `500 Internal Server Error`: Server error

**Validation:**
- Email must be a valid email format
- Password must be at least 6 characters
- Name is required

---

### 2. POST /api/auth/login

Authenticate user and get JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid email or password
- `500 Internal Server Error`: Server error

---

### 3. GET /api/auth/me

Get current authenticated user's profile (Protected).

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing token, invalid token, or expired token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

---

## Security

- Passwords are hashed using bcryptjs with salt rounds = 10
- JWTs are signed with a secret key (set via JWT_SECRET env variable)
- JWT tokens expire after 24 hours
- Protected endpoints require valid Bearer token in Authorization header
- Passwords are never returned in responses

## Implementation Details

### Password Hashing
- Algorithm: bcryptjs with 10 salt rounds
- Passwords are hashed during registration
- Password verification uses bcrypt.compare() for secure comparison

### JWT Token
- Algorithm: HS256 (HMAC SHA256)
- Expiration: 24 hours
- Payload includes: id, email, name
- Required for accessing protected endpoints

### Token Format
```
Authorization: Bearer <token>
```

Where `<token>` is the JWT string received from login or register endpoints.

## Usage Example

```javascript
// Register
const registerRes = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe',
    password: 'securePass123'
  })
});
const { token } = await registerRes.json();

// Login (alternative to register)
const loginRes = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePass123'
  })
});
const { token } = await loginRes.json();

// Get current user (protected)
const meRes = await fetch('/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { user } = await meRes.json();
```

## Environment Variables

```
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

**Important:** Change the JWT_SECRET in production to a strong random string.
