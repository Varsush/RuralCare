import json

import httpx

from app.core.config import (
    OPENROUTER_API_KEY,
    OPENROUTER_URL,
    GEMMA_MODEL,
)


async def generate_clinical_summary(
    complaint: str,
    relationship: str,
    questions: list,
    answers: dict,
    language: str,
):
    if not OPENROUTER_API_KEY:
        raise RuntimeError(
            "OPENROUTER_API_KEY is not configured."
        )

    qa_text = ""

    for question in questions:
        question_id = str(question.get("id"))
        answer = answers.get(question_id)

        if answer is None:
            answer = answers.get(int(question_id), "Not answered")

        qa_text += (
            f"\nQuestion: {question.get('question')}"
            f"\nAnswer: {answer}\n"
        )

    prompt = f"""
You are SahayakAI, an AI assistant supporting ASHA workers
during rural community health visits.

Prepare a concise, factual clinical summary for a doctor
based ONLY on the information reported by the patient.

Patient relationship with household head:
{relationship}

Original patient complaint:
{complaint}

Follow-up questions and patient answers:
{qa_text}

Required language:
{language}

IMPORTANT RULES:

1. Write the summary in the SAME language as the patient's
   complaint.

2. If the language is Kannada, use natural, simple,
   conversational Kannada.

3. Do not translate English word-for-word into Kannada.

4. Do NOT diagnose the patient.

5. Do NOT prescribe medicines.

6. Do NOT recommend treatment.

7. Do NOT invent symptoms, measurements, medical history,
   duration, or other information that the patient did not
   provide.

8. Clearly distinguish reported information from AI
   interpretation.

9. Include only clinically relevant information from the
   complaint and answers.

10. If information is missing, do not guess.

11. Mention symptoms that were specifically reported.

12. Mention important negative symptoms only when the patient
    explicitly answered that they do not have them.

13. Keep the summary concise and suitable for a doctor to review.

14. Return ONLY valid JSON.

Return exactly this structure:

{{
    "language": "{language}",
    "summary": "...",
    "reported_symptoms": [
        "..."
    ],
    "important_observations": [
        "..."
    ]
}}
"""

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": GEMMA_MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You create safe, factual clinical summaries "
                    "from patient-reported information. "
                    "Never diagnose or prescribe treatment."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        "temperature": 0.2,
        "max_tokens": 1200,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            OPENROUTER_URL,
            headers=headers,
            json=payload,
        )

    response.raise_for_status()

    data = response.json()

    content = data["choices"][0]["message"]["content"].strip()

    if content.startswith("```"):
        content = content.replace("```json", "")
        content = content.replace("```", "")
        content = content.strip()

    return json.loads(content)