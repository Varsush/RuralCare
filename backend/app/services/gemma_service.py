import json
import re

import httpx

from app.core.config import (
    OPENROUTER_API_KEY,
    OPENROUTER_URL,
    GEMMA_MODEL,
)


def clean_json_response(content: str) -> str:
    """
    Clean common formatting problems from the model response.
    """

    if not content:
        raise RuntimeError("Gemma returned an empty response.")

    content = content.strip()

    # Remove markdown code fences if the model still adds them
    content = re.sub(
        r"^```json\s*",
        "",
        content,
        flags=re.IGNORECASE,
    )

    content = re.sub(
        r"^```\s*",
        "",
        content,
    )

    content = re.sub(
        r"\s*```$",
        "",
        content,
    )

    content = content.strip()

    # Sometimes models add a sentence before/after JSON.
    # Extract only the JSON object.
    start = content.find("{")
    end = content.rfind("}")

    if start == -1 or end == -1 or end <= start:
        raise RuntimeError(
            "Gemma did not return a valid JSON object."
        )

    content = content[start:end + 1]

    return content


async def generate_follow_up_questions(
    complaint: str,
    relationship: str,
    language: str,
):

    if not OPENROUTER_API_KEY:
        raise RuntimeError(
            "OPENROUTER_API_KEY is not configured."
        )

    prompt = f"""
You are SahayakAI, an AI assistant supporting ASHA workers
during rural community health visits.

The patient has reported the following health complaint.

Patient relationship with household head:
{relationship}

Patient complaint:
{complaint}

Preferred language:
{language}

Your task is to generate exactly 6 useful follow-up questions
that an ASHA worker can ask the patient.

IMPORTANT LANGUAGE RULES:

1. Ask questions in the SAME language as the patient's complaint.

2. Currently supported languages are:
   - Kannada
   - English

3. If the language is Kannada:
   - Use natural spoken Kannada.
   - Use simple everyday Kannada.
   - Write ONLY Kannada script.
   - Do NOT use English transliteration.
   - Do NOT write Kannada pronunciation using English letters.
   - Do NOT mix English words into Kannada unnecessarily.

4. If the language is English:
   - Use simple, clear English.

5. Questions must sound natural when an ASHA worker
   reads them aloud to a rural patient.

MEDICAL QUESTION RULES:

6. First understand the patient's actual complaint.

7. Do NOT use the same questionnaire for every complaint.

8. Questions must be directly related to the complaint.

9. Ask about useful information such as:
   - duration
   - severity
   - location
   - associated symptoms
   - changes over time
   - previous medicine or treatment

10. Only ask about information that is relevant.

11. Do not diagnose the patient.

12. Do not prescribe medicines.

13. Do not recommend treatment.

14. Do not make assumptions about the patient's condition.

OPTIONS:

15. Every question must have exactly 4 options.

16. Options must be short and easy to understand.

17. Options must be written in the SAME language
    as the question.

18. If Kannada is requested, options must also be
    written in Kannada script.

19. Do not use English transliterations in Kannada options.

20. Do not put translations in brackets.

21. Do not use technical medical terminology unless necessary.

KANNADA QUALITY CHECK:

22. Never output corrupted Kannada.

23. Never output random English fragments inside Kannada.

24. Never output transliterations such as:
    "Nimagu"
    "Havud"
    "Illa"
    "Nimmagu"
    "clinic"

25. Never output placeholders such as:
    "addGroup"
    "bVert"
    "maddGroup"

26. Before returning the answer, check every question
    and every option for language consistency.

27. If the requested language is Kannada, use Kannada Unicode
    characters for the actual question and options.

QUESTION QUALITY:

28. Generate exactly 5 questions.

29. Questions should progressively collect useful information.

30. Avoid asking duplicate questions.

31. Do not ask unrelated questions.

EXAMPLE:

For a fever and body pain complaint, questions could cover:
- how long the fever has been present
- severity of the fever
- where body pain is present
- chills or shivering
- other relevant symptoms
- medicine already taken

For a skin complaint, questions could cover:
- location
- duration
- itching
- pain
- redness or swelling
- whether the problem is spreading
- treatment already used

These are examples only.

Generate questions based on the ACTUAL complaint.

Return ONLY the JSON object.
Do not return markdown.
Do not return explanations.
Do not return code fences.

The JSON must follow exactly this structure:

{{
    "language": "{language}",
    "questions": [
        {{
            "id": 1,
            "question": "Question",
            "options": [
                "Option 1",
                "Option 2",
                "Option 3",
                "Option 4"
            ]
        }},
        {{
            "id": 2,
            "question": "Question",
            "options": [
                "Option 1",
                "Option 2",
                "Option 3",
                "Option 4"
            ]
        }},
        {{
            "id": 3,
            "question": "Question",
            "options": [
                "Option 1",
                "Option 2",
                "Option 3",
                "Option 4"
            ]
        }},
        {{
            "id": 4,
            "question": "Question",
            "options": [
                "Option 1",
                "Option 2",
                "Option 3",
                "Option 4"
            ]
        }},
        {{
            "id": 5,
            "question": "Question",
            "options": [
                "Option 1",
                "Option 2",
                "Option 3",
                "Option 4"
            ]
        }},
        {{
            "id": 6,
            "question": "Question",
            "options": [
                "Option 1",
                "Option 2",
                "Option 3",
                "Option 4"
            ]
        }}
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
                    "You are SahayakAI. "
                    "Generate safe healthcare intake questions. "
                    "Return only valid JSON. "
                    "Strictly follow the requested language."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],

        "temperature": 0.1,

        "max_tokens": 1800,

        # IMPORTANT:
        # Ask Gemma/OpenRouter to return structured JSON.
        "response_format": {
            "type": "json_object"
        },
    }

    async with httpx.AsyncClient(timeout=90.0) as client:

        response = await client.post(
            OPENROUTER_URL,
            headers=headers,
            json=payload,
        )

    # If OpenRouter itself returned an error,
    # show the actual API response.
    if response.status_code >= 400:

        try:
            error_data = response.json()
        except Exception:
            error_data = response.text

        print("\n========== OPENROUTER ERROR ==========")
        print(error_data)
        print("======================================\n")

        raise RuntimeError(
            f"OpenRouter request failed: {response.status_code}"
        )

    data = response.json()

    # -----------------------------------------
    # Extract model response
    # -----------------------------------------

    try:
        content = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as exc:

        print("\n========== INVALID MODEL RESPONSE ==========")
        print(data)
        print("============================================\n")

        raise RuntimeError(
            "Invalid response received from Gemma."
        ) from exc

    # -----------------------------------------
    # Clean response
    # -----------------------------------------

    content = clean_json_response(content)

    # -----------------------------------------
    # Parse JSON
    # -----------------------------------------

    try:

        result = json.loads(content)

    except json.JSONDecodeError as exc:

        print("\n========== INVALID GEMMA JSON ==========")
        print(content)
        print("========================================\n")

        raise RuntimeError(
            f"Gemma returned invalid JSON: {exc}"
        ) from exc

    # -----------------------------------------
    # Validate structure
    # -----------------------------------------

    if not isinstance(result, dict):

        raise RuntimeError(
            "Gemma response is not a JSON object."
        )

    if "questions" not in result:

        raise RuntimeError(
            "Gemma response does not contain 'questions'."
        )

    questions = result["questions"]

    if not isinstance(questions, list):

        raise RuntimeError(
            "'questions' must be a list."
        )

    if len(questions) < 5:

        raise RuntimeError(
            "Gemma returned fewer than 5 questions."
        )

    # Keep maximum of 6
    questions = questions[:6]

    # -----------------------------------------
    # Validate every question
    # -----------------------------------------

    for index, question in enumerate(questions):

        if not isinstance(question, dict):

            raise RuntimeError(
                f"Question {index + 1} is invalid."
            )

        if "question" not in question:

            raise RuntimeError(
                f"Question {index + 1} has no question text."
            )

        if "options" not in question:

            raise RuntimeError(
                f"Question {index + 1} has no options."
            )

        if not isinstance(question["options"], list):

            raise RuntimeError(
                f"Options for question {index + 1} "
                "must be a list."
            )

        if len(question["options"]) < 3:

            raise RuntimeError(
                f"Question {index + 1} has fewer than "
                "3 options."
            )

        # Ensure IDs are consistent
        question["id"] = index + 1

    result["questions"] = questions

    # Always return requested language
    result["language"] = language

    return result