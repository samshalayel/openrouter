from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timedelta
import jwt
import os
from app.schemas.auth import LoginRequest, LoginResponse

router = APIRouter(prefix="/api", tags=["auth"])

# Secret key for JWT (in production, use environment variable)
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

# Mock user database (in production, use real database)
VALID_CREDENTIALS = {
    "demo@openrouter.com": "password"
}

def create_access_token(email: str, expires_delta: timedelta = None):
    """Create JWT access token"""
    if expires_delta is None:
        expires_delta = timedelta(hours=24)
    
    expire = datetime.utcnow() + expires_delta
    to_encode = {"email": email, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Login endpoint
    
    Expected request:
    {
        "email": "demo@openrouter.com",
        "password": "password"
    }
    """
    # Validate credentials
    if request.email not in VALID_CREDENTIALS or VALID_CREDENTIALS[request.email] != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create JWT token
    access_token = create_access_token(email=request.email)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": request.email,
            "name": request.email.split("@")[0]
        }
    }
