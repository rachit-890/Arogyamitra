from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import User, UserProfile, get_db
from schemas import UserProfileCreate, UserProfileOut, UserOut
from api.deps import get_current_user

router = APIRouter()

@router.get("/profile", response_model=UserProfileOut)
def read_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/profile", response_model=UserProfileOut)
def update_user_profile(
    profile_in: UserProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = UserProfile(user_id=current_user.id, **profile_in.model_dump(exclude_unset=True))
        db.add(profile)
    else:
        for var, value in profile_in.model_dump(exclude_unset=True).items():
            setattr(profile, var, value)
    
    db.commit()
    db.refresh(profile)
    return profile
