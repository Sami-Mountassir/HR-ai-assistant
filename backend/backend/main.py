from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from .ai_client import ask_gemini, talk_to_gemini
from .models import DataForSimulation, ChatMessage, FireEmployeeRequest, LetGoRequest
from .prompts import ROLE_TEMPLATE, FIRING_EMPLOYEE_TEMPLATE, LETTING_GO_PROMPT

app = FastAPI(title="HR Promotion Simulator API")

# CORS — allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "AI backend running"}


@app.post("/predict")
def simulate_promotion(data: DataForSimulation):
    prompt = ROLE_TEMPLATE(name=data.name, next_role=data.next_role)
    analysis = ask_gemini(prompt)
    return {"analysis": analysis}


@app.post("/fire")
def fire_or_retain(data: FireEmployeeRequest):
    prompt = FIRING_EMPLOYEE_TEMPLATE(name=data.name, notes=data.notes)
    analysis = ask_gemini(prompt)
    return {"analysis": analysis}


@app.post("/layoffs")
def plan_layoffs(data: LetGoRequest):
    prompt = LETTING_GO_PROMPT(
        financial_status_input=data.financial_status,
        budget_target=data.budget_target,
        high_risk_departments_input=data.high_risk_departments,
    )
    analysis = ask_gemini(prompt)
    return {"analysis": analysis}


def chatbot(user_input: str, history: Optional[List[str]] = None) -> str:
    system_context = """You are an HR strategy expert.
Help analysis based on the database provided and the user (manager) requests."""
    if history is None or len(history) == 0:
        conversation = f"User: {user_input}"
    else:
        conversation = "\n".join(history) + f"\nUser: {user_input}"
    return talk_to_gemini(system_context, conversation)


@app.post("/chatbot")
async def manager_helper(chat: ChatMessage):
    user_input = chat.message
    history = chat.history or []
    reply = chatbot(user_input, history)
    history.append(f"User: {user_input}")
    history.append(f"Assistant: {reply}")
    return {"reply": reply, "history": history}


@app.post("/clear")
def clear_chatbot():
    return {"reply": "How can I assist you?", "history": []}
