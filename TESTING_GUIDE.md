# ✅ اختبار شامل للمشروع
## Comprehensive Project Testing Guide

### 📋 Test Scenarios

#### 1. User Registration & Authentication Flow
- [ ] Register new user with valid credentials
- [ ] Verify email format validation
- [ ] Reject duplicate email registration
- [ ] Successful login with correct credentials
- [ ] Reject login with wrong password
- [ ] Reject login with non-existent email
- [ ] User logout functionality

#### 2. Data Display After Login
- [ ] User dashboard displays correctly
- [ ] User profile information loads
- [ ] Data persists after page refresh
- [ ] Correct user data shown (not other users' data)

#### 3. CORS Testing (Frontend: 3000 ↔ Backend: 8000)
- [ ] Preflight OPTIONS requests succeed
- [ ] POST requests from 3000 → 8000 allowed
- [ ] GET requests from 3000 → 8000 allowed
- [ ] Credentials/cookies transmitted correctly
- [ ] CORS headers present in responses

#### 4. Error Cases
- [ ] Duplicate email: Shows appropriate error message
- [ ] Wrong password: Shows "Invalid credentials" or similar
- [ ] Network timeout handling
- [ ] 401 Unauthorized handling
- [ ] 500 Server error handling

#### 5. Session & Security
- [ ] Session maintains across requests
- [ ] Logout clears session
- [ ] Protected routes reject unauthenticated users
- [ ] Token/session expires appropriately

### 🚀 Running the Project

```bash
# Terminal 1: Start Backend (uvicorn)
uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Start Frontend (npm)
npm run dev  # runs on port 3000
```

### ✅ Test Execution Steps

1. Open browser: http://localhost:3000
2. Register new user → Verify success
3. Login → Verify dashboard loads
4. Check browser network tab → Verify CORS headers
5. Try duplicate email → Verify error
6. Try wrong password → Verify error
7. Logout → Verify redirect
8. Try accessing protected route without auth → Verify rejection

### 📊 Expected Results
All tests should pass with proper error messages and CORS headers in place.
