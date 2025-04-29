from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import users  # Import your API routers
# from app.ai_model import predict_emotions  # Import your AI model prediction
from pydantic import BaseModel
import asyncio

app = FastAPI()

# Allow frontend requests (CORS settings)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/users", tags=["Users"])

# Define input format for /api/analyze
class TextInput(BaseModel):
    text: str

# @app.post("/api/analyze")
# async def analyze(input: TextInput):
#     print("Received:", input.text)
#
#     await asyncio.sleep(1.5)  # Simulate processing delay
#
#     results = predict_emotions(input.text)
#
#     print("Response:", results)
#
#     return {"result": results}

# Health check
@app.get("/")
def read_root():
    return {"status": "running"}
