import json
from groq import Groq
from core.config import settings
from schemas import WorkoutPlanRequest, MealPlanRequest, ChatMessage

# Initialize Groq client conditionally
client = None
if settings.GROQ_API_KEY:
    try:
        client = Groq(api_key=settings.GROQ_API_KEY)
    except Exception as e:
        print(f"Error initializing Groq client: {e}")

MODEL_NAME = "llama-3.3-70b-versatile"

def generate_workout_plan(request: WorkoutPlanRequest, user_profile: dict):
    if not client:
        return {"message": "Groq API key not configured. Mock workout plan generated.", "plan": "Mock 7-day plan."}
        
    prompt = f"""
    You are an expert AI fitness coach. Create a personalized 7-day workout plan for a user with the following profile:
    Age: {user_profile.get('age', 'Unknown')}
    Weight: {user_profile.get('weight_kg', 'Unknown')} kg
    Height: {user_profile.get('height_cm', 'Unknown')} cm
    Goal: {request.goal}
    Workout Preference: {request.workout_type}
    Time Available: {request.time_minutes} minutes/day
    Medical History: {user_profile.get('medical_history', 'None')}

    Format the response as a JSON object with a key 'plan' containing a list of 7 daily workout objects.
    Each day must include: day (1-7), focus, warmup, exercises (list), and a daily_tip.
    Mock YouTube links for exercises using 'youtube.com/watch?v=mock'.
    """
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=MODEL_NAME,
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        return {"error": str(e)}

def generate_meal_plan(request: MealPlanRequest, user_profile: dict):
    if not client:
        return {"message": "Groq API key not configured. Mock meal plan generated.", "plan": "Mock 7-day Indian meal plan."}

    prompt = f"""
    You are an expert AI nutritionist. Create a personalized 7-day meal plan for a user with:
    Calories: {request.calories} / day
    Diet: {request.diet}
    Allergies: {request.allergies}
    
    The user prefers Indian cuisine options if possible, or a mix of global healthy meals.
    Format the response as a JSON object with a key 'plan' containing a list of 7 daily meal objects.
    Each daily object should have: day (1-7), breakfast, lunch, dinner, snacks, and macro_breakdown.
    """
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=MODEL_NAME,
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        return {"error": str(e)}

def chat_with_aromi(message: str, user_profile: dict):
    if not client:
        return {"reply": "Groq API key not configured. Mock AROMI response."}

    prompt = f"""
    You are AROMI, an empathetic AI conversational fitness coach.
    User Profile: Age {user_profile.get('age')}, Goal: {user_profile.get('fitness_goal')}.
    User says: "{message}"
    
    Provide a concise, motivating, and helpful reply. Adjust their plans dynamically if circumstances change (e.g., travel, injury).
    """
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=MODEL_NAME
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}
