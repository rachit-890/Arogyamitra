from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import User, UserProfile, get_db
from schemas import WorkoutPlanRequest, MealPlanRequest, ChatMessage
from api.deps import get_current_user
from services.ai_agent import generate_workout_plan, generate_meal_plan, chat_with_aromi

router = APIRouter()

def get_user_profile_dict(db: Session, user_id: int):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if profile:
        return {"age": profile.age, "weight_kg": profile.weight_kg, "height_cm": profile.height_cm,
                "fitness_goal": profile.fitness_goal, "allergies": profile.allergies,
                "medical_history": profile.medical_history, "workout_preference": profile.workout_preference,
                "diet_preference": profile.diet_preference}
    return {}

@router.post("/workout-plan")
def get_workout_plan(
    request: WorkoutPlanRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_user_profile_dict(db, current_user.id)
    return generate_workout_plan(request, profile)

@router.post("/meal-plan")
def get_meal_plan(
    request: MealPlanRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_user_profile_dict(db, current_user.id)
    return generate_meal_plan(request, profile)

@router.post("/chat-aromi")
def chat_aromi(
    message: ChatMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_user_profile_dict(db, current_user.id)
    return chat_with_aromi(message.message, profile)
