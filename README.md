# BMW HR AI Assistant — Leadership OS

A full-stack HR decision-support platform built for BMW, combining real-time AI-powered workforce simulations with a premium, immersive interface.

---

## 📋 Overview

Leadership OS empowers HR managers and executives to make data-driven workforce decisions through interactive AI simulations. The platform covers promotion readiness, termination analysis, workforce restructuring, retention risk, succession planning, fairness audits, and CV evaluation — all powered by Google Gemini.

---

## ✨ Key Features

### 🎯 Simulation Modes
- **Promotion Readiness** — Analyze employee readiness for role advancement with scoring and recommendations
- **Firing/Termination Analysis** — Impact assessment covering performance, financial, legal, and team morale factors
- **Workforce Restructuring (Layoffs)** — Cost reduction planning with department-level analysis and budget targets
- **Retention Risk** — Identify flight-risk employees based on engagement, compensation, and career trajectory
- **Succession Planning** — Gap analysis for leadership roles with coverage metrics
- **Fairness & Bias Audit** — Evaluate promotion decisions for gender, age, and tenure bias
- **CV Evaluation** — Multi-candidate comparison with scoring across technical skills, experience, and cultural fit

### 💬 AI Chat Interface
- Real-time conversational interface with the AI assistant
- Context-aware responses based on simulation type
- Chat history management with multiple sessions
- Graceful fallback to mock data when backend is unavailable

### 🎨 Premium UI/UX
- Dark void theme with glassmorphism effects
- Animated landing page with GSAP-powered canvas animations
- Responsive design across desktop and mobile
- BMW-quality visual polish

---

## 🏗️ Architecture

```
┌─────────────────────┐         ┌──────────────────────┐
│   Frontend (React)  │  HTTP   │   Backend (FastAPI)   │
│                     │ ──────► │   Railway             │
│                     │         │                       │
│  • React + TS       │         │  • /predict           │
│  • Tailwind CSS     │         │  • /fire              │
│  • GSAP animations  │         │  • /layoffs           │
│  • shadcn/ui        │         │  • /chatbot           │
└─────────────────────┘         │  • /clear             │
                                └───────┬──────────────┘
                                        │
                          ┌─────────────┴──────────────┐
                          │                            │
                    ┌─────▼─────┐              ┌──────▼──────┐
                    │  Gemini   │              │  PostgreSQL  │
                    │  2.0 Flash│              │  (Supabase)  │
                    └───────────┘              └─────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| GSAP | Animations |
| React Router | Client-side routing |
| TanStack Query | Server state management |
| Recharts | Data visualization |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| Google GenAI SDK | Gemini 2.0 Flash integration |
| SQLAlchemy | Database ORM |
| psycopg2 | PostgreSQL driver |

### Infrastructure
| Service | Purpose |
|---|---|
| Railway | Backend hosting |
| Supabase | PostgreSQL database |
| Google AI Studio | Gemini API access |

---

## 📁 Project Structure

```
├── src/                          # Frontend source
│   ├── components/
│   │   ├── chat/                 # Chat UI components
│   │   │   ├── AmbientBackground.tsx
│   │   │   ├── ChatHeader.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatSidebar.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── NewSimulationModal.tsx
│   │   │   ├── TypingIndicator.tsx
│   │   │   └── WelcomeState.tsx
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── DashboardNav.tsx
│   │   └── NavLink.tsx
│   ├── lib/
│   │   ├── api.ts                # Backend API integration
│   │   ├── chatData.ts           # Mock data & response types
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Landing.tsx           # Animated landing page
│   │   ├── Chat.tsx              # Main chat interface
│   │   ├── Dashboard.tsx         # Analytics dashboard
│   │   └── Index.tsx
│   └── index.css                 # Design tokens & theme
│
├── backend-deploy/               # Backend source (separate repo)
│   ├── backend/
│   │   ├── main.py               # FastAPI routes
│   │   ├── ai_client.py          # Gemini API wrapper
│   │   ├── models.py             # Pydantic models
│   │   └── prompts.py            # Prompt templates
│   ├── database/
│   │   ├── database_management.py
│   │   ├── database_functions.py
│   │   ├── Employees.py
│   │   ├── Departments.py
│   │   ├── Teams.py
│   │   └── Skills.py
│   ├── requirements.txt
│   ├── Procfile
│   └── railway.json
```

---

## ⚙️ API Endpoints

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/` | Health check | — |
| `POST` | `/predict` | Promotion readiness simulation | `{ name, next_role }` |
| `POST` | `/fire` | Termination impact analysis | `{ name, notes? }` |
| `POST` | `/layoffs` | Workforce restructuring plan | `{ financial_status, budget_target, high_risk_departments }` |
| `POST` | `/chatbot` | General HR chat | `{ message, history? }` |
| `POST` | `/clear` | Reset chat history | — |

---

## 🚀 Deployment

### Frontend 
Environment variable required:
- `VITE_API_BASE_URL` — Backend API URL (e.g., `https://project-bmw-production.up.railway.app`)

### Backend (Railway)
The backend is deployed on Railway from the GitHub repo. Environment variables required:
- `DATABASE_URL` — PostgreSQL connection string (Supabase). **Note:** Special characters in the password must be URL-encoded (e.g., `?` → `%3F`)
- `GEMINI_API_KEY` — Google AI Studio API key

### Database (Supabase)
PostgreSQL database hosted on Supabase, containing employee records, departments, teams, and skills data.

---

## 🔧 Local Development

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd backend-deploy
pip install -r requirements.txt
cp .env.example .env  # Add DATABASE_URL and GEMINI_API_KEY
uvicorn backend.main:app --reload --port 8000
```

---

## 📝 Environment Variables

| Variable | Location | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Frontend  | Backend API base URL |
| `DATABASE_URL` | Backend (Railway) | Supabase PostgreSQL connection string |
| `GEMINI_API_KEY` | Backend (Railway) | Google Gemini API key from AI Studio |

---

## 👥 Team

Built for the BMW Hackathon 2026.

---

## 📄 License

This project is proprietary and built for BMW internal use.
