from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import users, analysis

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(analysis.router, prefix="/api", tags=["Analysis"])


@app.get("/")
def read_root():
    return {"status": "running"}
