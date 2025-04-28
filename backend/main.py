from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import predict_emotions
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextInput(BaseModel):
    text: str


@app.post("/api/analyze")
async def analyze(input: TextInput):
    print("Received:", input.text)

    await asyncio.sleep(1.5)

    results = predict_emotions(input.text)

    print("Response:", results)

    return {"result": results}
