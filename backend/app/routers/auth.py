from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import httpx
import logging
from app.config import settings

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

class TokenRequest(BaseModel):
    code: str
    code_verifier: str  # ADD THIS FIELD

@router.post("/google/token")
async def exchange_google_token(request: TokenRequest):
    """Exchange authorization code for tokens - SECURE with client secret"""
    
    logger.debug(f"Received token exchange request with code: {request.code[:10]}...")
    logger.debug(f"Received code_verifier: {request.code_verifier[:10]}...")  # Log first 10 chars
    
    # Log the configuration (without exposing full secret)
    logger.debug(f"Using client_id: {settings.google_client_id}")
    logger.debug(f"Using redirect_uri: {settings.frontend_url}/")
    
    async with httpx.AsyncClient() as client:
        # Token exchange - secret and verifier are used HERE
        token_response = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": request.code,
                "client_id": settings.google_client_id,
                "client_secret": settings.google_client_secret,
                "redirect_uri": f"{settings.frontend_url}/",
                "grant_type": "authorization_code",
                "code_verifier": request.code_verifier,  # NOW INCLUDED!
            }
        )
        
        # Log the response from Google
        logger.debug(f"Google token response status: {token_response.status_code}")
        
        if token_response.status_code != 200:
            error_data = token_response.json()
            logger.error(f"Google error: {error_data}")
            raise HTTPException(
                status_code=400, 
                detail=error_data.get("error_description", "Token exchange failed")
            )
        
        tokens = token_response.json()
        logger.debug("Successfully obtained access token")
        
        # Get user info (optional)
        user_response = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {tokens['access_token']}"}
        )
        
        user_info = user_response.json() if user_response.status_code == 200 else {}
        
        return {
            "access_token": tokens["access_token"],
            "refresh_token": tokens.get("refresh_token"),
            "expires_in": tokens["expires_in"],
            "user": user_info
        }