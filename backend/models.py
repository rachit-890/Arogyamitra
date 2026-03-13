from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from core.config import settings

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    progress_records = relationship("Progress", back_populates="user")

class UserProfile(Base):
    __tablename__ = 'user_profiles'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    age = Column(Integer)
    weight_kg = Column(Float)
    height_cm = Column(Float)
    fitness_goal = Column(String)  # e.g., Weight Loss, Muscle Gain
    allergies = Column(Text)
    medical_history = Column(Text)
    workout_preference = Column(String)  # e.g., Home Workouts, Gym
    diet_preference = Column(String) # e.g., Vegetarian, Vegan, Any

    user = relationship("User", back_populates="profile")

class Progress(Base):
    __tablename__ = 'progress'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    date = Column(DateTime, default=datetime.utcnow)
    calories_burned = Column(Float, default=0.0)
    workout_completed = Column(Boolean, default=False)
    charity_points = Column(Integer, default=0)

    user = relationship("User", back_populates="progress_records")

# Database Setup
engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
