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

        # Current Vercel deployment
        "https://rural-care-n30tz0sba-varsha-hegdes-projects.vercel.app",

        # Previous Vercel deployment
        "https://rural-care-hup9aowqu-varsha-hegdes-projects.vercel.app",

        # Main Vercel project domain
        "https://rural-care-ruby.vercel.app",
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