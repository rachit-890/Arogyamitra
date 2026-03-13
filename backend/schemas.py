from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    name: str

class UserProfileBase(BaseModel):
    age: Optional[int] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    fitness_goal: Optional[str] = None
    allergies: Optional[str] = None
    medical_history: Optional[str] = None
    workout_preference: Optional[str] = None
    diet_preference: Optional[str] = None

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileOut(UserProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class UserOut(UserBase):
    id: int
    name: str
    created_at: datetime
    profile: Optional[UserProfileOut] = None

    class Config:
        from_attributes = True

class WorkoutPlanRequest(BaseModel):
    goal: str
    workout_type: str
    time_minutes: int

class MealPlanRequest(BaseModel):
    calories: int
    diet: str
    allergies: str

class ChatMessage(BaseModel):
    message: str

class ProgressUpdate(BaseModel):
    calories_burned: float = 0.0
    workout_completed: bool = False
    charity_points: int = 0
