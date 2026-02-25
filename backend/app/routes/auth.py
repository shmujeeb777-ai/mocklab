from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from pydantic import BaseModel
from app.config import settings
import jwt
from datetime import datetime, timedelta
import httpx
from dotenv import load_dotenv
load_dotenv()
router = APIRouter(prefix="/auth", tags=["auth"])

GOOGLE_CLIENT_ID = settings.google_client_id
GOOGLE_CLIENT_SECRET = settings.google_client_secret
JWT_SECRET = settings.jwt_secret
JWT_ALGORITHM = "HS256"

class GoogleTokenRequest(BaseModel):
    token: str

def create_jwt_token(user_id: str, email: str):
    """Create JWT token for user"""
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(days=30),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def verify_google_token(token: str):
    """Verify Google ID token"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://www.googleapis.com/oauth2/v1/tokeninfo?id_token={token}"
            )
            if response.status_code != 200:
                return None
            return response.json()
    except Exception as e:
        print(f"Error verifying token: {e}")
        return None

@router.post("/google")
async def google_login(request: GoogleTokenRequest, db: Session = Depends(get_db)):
    """Google OAuth login/signup"""
    
    # Verify Google token
    token_info = await verify_google_token(request.token)
    if not token_info:
        raise HTTPException(status_code=401, detail="Invalid Google token")
    
    google_id = token_info.get("user_id")
    email = token_info.get("email")
    name = token_info.get("name")
    picture = token_info.get("picture")
    
    # Check if user exists
    user = db.query(User).filter(User.google_id == google_id).first()
    
    if not user:
        # Create new user
        user = User(
            google_id=google_id,
            email=email,
            name=name,
            picture=picture
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update picture if changed
        if user.picture != picture:
            user.picture = picture
            db.commit()
    
    # Create JWT token
    jwt_token = create_jwt_token(user.id, user.email)
    
    return {
        "success": True,
        "user": user.to_dict(),
        "token": jwt_token
    }

@router.get("/profile")
async def get_profile(token: str = None, db: Session = Depends(get_db)):
    """Get current user profile"""
    if not token:
        raise HTTPException(status_code=401, detail="No token provided")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"success": True, "user": user.to_dict()}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/logout")
async def logout():
    """Logout (frontend should clear token)"""
    return {"success": True, "message": "Logged out successfully"}
