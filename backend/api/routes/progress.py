from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from models import Progress, User, get_db
from schemas import ProgressUpdate
from api.deps import get_current_user
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[dict])
def get_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    records = db.query(Progress).filter(Progress.user_id == current_user.id).order_by(Progress.date.desc()).all()
    return [{"date": r.date, "calories_burned": r.calories_burned, "workout_completed": r.workout_completed, "charity_points": r.charity_points} for r in records]

@router.post("/update")
def update_progress(
    progress_in: ProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    today = datetime.utcnow().date()
    # Check if a record exists for today
    record = db.query(Progress).filter(
        Progress.user_id == current_user.id
    ).order_by(Progress.date.desc()).first()
    
    if record and record.date.date() == today:
        record.calories_burned += progress_in.calories_burned
        record.workout_completed = progress_in.workout_completed or record.workout_completed
        record.charity_points += progress_in.charity_points
    else:
        record = Progress(
            user_id=current_user.id,
            calories_burned=progress_in.calories_burned,
            workout_completed=progress_in.workout_completed,
            charity_points=progress_in.charity_points
        )
        db.add(record)
        
    db.commit()
    db.refresh(record)
    return {"status": "success", "charity_points": record.charity_points}
