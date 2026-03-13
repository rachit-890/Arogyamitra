import sys
from models import SessionLocal, User
from schemas import UserCreate
from api.routes.auth import register_user

db = SessionLocal()
try:
    user_in = UserCreate(email="user4@test.com", password="abc", name="User")
    res = register_user(user_in=user_in, db=db)
    print("Success", res)
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
