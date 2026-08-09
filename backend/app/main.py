from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.ai import router as ai_router


app = FastAPI(
    title="SahayakAI API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",

        # Add your Vercel frontend URL here after deployment.
        # Example:
        # "https://ruralcare.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(ai_router)


@app.get("/")
def home():
    return {
        "message": "SahayakAI Backend Running 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "OK"
    }