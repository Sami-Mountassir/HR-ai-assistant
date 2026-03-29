from google import genai
import os
from dotenv import load_dotenv

# Load API key
load_dotenv()
key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=key)

# NOTE: Double-check the model name in the Gemini docs.
# "gemini-3-flash-preview" does not exist — common options are:
#   "gemini-2.0-flash"  or  "gemini-1.5-flash"
GEMINI_MODEL = "gemini-2.0-flash"


def ask_gemini(role_prompt: str) -> str:
    """Send prompt to Gemini and return the text response."""
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        config=genai.types.GenerateContentConfig(
            system_instruction="Analyze the scenario.",
            temperature=0.4
        ),
        contents=role_prompt
    )
    return response.text


def talk_to_gemini(system_context: str, conversation: str) -> str:
    """Send system context and conversation history to Gemini."""
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        config=genai.types.GenerateContentConfig(
            system_instruction=system_context,
            temperature=0.2
        ),
        contents=conversation
    )
    return response.text
