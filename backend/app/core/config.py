import os

from dotenv import load_dotenv


load_dotenv()


OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

GEMMA_MODEL = os.getenv(
    "GEMMA_MODEL",
    "google/gemma-4-26b-a4b-it"
)