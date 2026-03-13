from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from api.routes import auth, users, ai, progress
from models import init_db, SessionLocal, User
from core.security import get_password_hash

# Initialize DB tables
init_db()

def create_demo_user():
    db = SessionLocal()
    try:
        demo_user = db.query(User).filter(User.email == "demo@test.com").first()
        if not demo_user:
            demo_user = User(
                email="demo@test.com",
                hashed_password=get_password_hash("123456"),
                name="Demo User"
            )
            db.add(demo_user)
            db.commit()
    finally:
        db.close()

create_demo_user()

app = FastAPI(
    title="ArogyaMitra API",
    description="AI-powered fitness & wellness platform",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"])

app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to ArogyaMitra API"}
