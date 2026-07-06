# SakhiAI - AI-Powered Women's Health Assistant

SakhiAI is an intelligent women's health assistant that uses Google Gemini API to provide personalized health insights, symptom analysis, and medical guidance. It supports 16 Indian languages and provides accessible voice-based interactions.

## 🌟 Features

- **AI-Powered Symptom Analysis**: Use Google Gemini to analyze symptoms in natural language
- **Multilingual Support**: 16 Indian languages (English, Hindi, Tamil, Bengali, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Urdu, Assamese, Konkani, Manipuri, Sanskrit)
- **Voice Input/Output**: Speak your symptoms, listen to reports using Web Speech API
- **Emergency Detection**: Real-time detection of emergency conditions with immediate alerts
- **AI Chat Assistant**: Ask follow-up questions with conversation history persistence
- **Pregnancy-Aware**: Special analysis for pregnant users
- **Clinic Recommendations**: Find nearest healthcare facilities based on risk assessment
- **PDF Report Generation**: Download structured health reports
- **Mobile-First**: Responsive design optimized for low-end smartphones

## 🏗️ Architecture

```
Frontend (React + TypeScript + Vite)
    ↓ (HTTP REST)
FastAPI Backend
    ↓
Gemini Service Layer
    ↓
Risk Assessment Engine + Report Generator
    ↓
Language Detection & Translation
```

### Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Web Speech API (voice input/output)
- LocalStorage (chat persistence)
- Vitest + React Testing Library (testing)

**Backend:**
- FastAPI + Uvicorn
- Google Generative AI (Gemini 2.5 Flash)
- Pydantic (validation)
- langdetect (language detection)
- python-dotenv (environment configuration)

## 📋 Prerequisites

- Node.js 16+ and npm/yarn
- Python 3.8+
- Google Gemini API Key (free tier available)
- Modern web browser (Chrome/Firefox/Safari/Edge)

## 🚀 Quick Start

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API key"
3. Copy the key (you'll need it for `.env`)

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file and add your key
# Windows:
copy .env.template .env
# macOS/Linux:
cp .env.template .env

# Edit .env and paste your Gemini API key
# GEMINI_API_KEY=YOUR_KEY_HERE

# Start backend server
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

**Backend will run at:** `http://localhost:8000`
- Health check: `GET http://localhost:8000/health`
- API docs: `GET http://localhost:8000/docs` (FastAPI Swagger UI)

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd project

# Install dependencies
npm install
# or
yarn install

# Create .env.local file
# Windows:
copy .env.example .env.local
# macOS/Linux:
cp .env.example .env.local

# Verify backend URL in .env.local
# VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
# or
yarn dev
```

**Frontend will run at:** `http://localhost:5173`

### 4. Access the Application

1. Open browser to `http://localhost:5173`
2. Select language (auto-detected or manual)
3. Indicate pregnancy status (optional)
4. Select body part or describe symptoms
5. View AI-powered analysis
6. Ask follow-up questions in chat
7. Download report as PDF

---

## 📡 API Endpoints

### POST `/analyze`

Analyze symptoms using Gemini AI.

**Request:**
```json
{
  "text": "I have severe abdominal pain and nausea",
  "language": "en",
  "pregnant": false
}
```

**Response:**
```json
{
  "symptoms": ["abdominal pain", "nausea"],
  "severity": "moderate",
  "risk_level": "Medium",
  "possible_conditions": ["gastroenteritis", "food poisoning"],
  "recommendations": ["Stay hydrated", "Rest"],
  "report": "...",
  "detected_language": "English",
  "urgency": "medium",
  "emergency": false,
  "explanation": "...",
  "doctor_advice": "...",
  "preventive_screenings": [],
  "risk_score": 45,
  "condition_tags": ["GI"],
  "has_pregnancy_alert": false
}
```

### POST `/chat`

Continue conversation with AI.

**Request:**
```json
{
  "message": "Should I drink water?",
  "history": [
    { "role": "user", "content": "I have stomach pain" },
    { "role": "assistant", "content": "..." }
  ],
  "language": "en",
  "pregnant": false
}
```

**Response:**
```json
{
  "response": "Yes, staying hydrated is important..."
}
```

### GET `/health`

Check backend health.

**Response:**
```json
{
  "status": "ok"
}
```

---

## 🧪 Testing

### Run Unit Tests

```bash
cd project
npm run test
# or
yarn test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Test Files

- `src/__tests__/emergencyDetection.test.ts` - Emergency keyword detection
- `src/__tests__/useChatHistory.test.ts` - Chat history persistence
- `src/__tests__/e2e.test.ts` - End-to-end scenarios

---

## 🛠️ Development

### File Structure

```
SakhiAI-main/
├── backend/
│   ├── app.py                 # FastAPI entry point
│   ├── requirements.txt        # Python dependencies
│   ├── .env                   # Environment variables (DO NOT COMMIT)
│   ├── models/
│   │   └── request_models.py  # Pydantic models
│   ├── routes/
│   │   └── analyze.py         # API endpoints
│   ├── services/
│   │   ├── gemini_service.py  # Gemini wrapper
│   │   ├── language_service.py # Language detection
│   │   ├── risk_engine.py     # Risk assessment
│   │   └── report_service.py  # Report generation
│   └── utils/
│       └── prompts.py         # Prompt templates
│
├── project/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── .env.example           # Frontend env template
│   ├── src/
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # React entry point
│   │   ├── types.ts           # TypeScript types
│   │   ├── services/
│   │   │   └── api.ts         # API service layer
│   │   ├── types/
│   │   │   └── api.ts         # API contract types
│   │   ├── hooks/
│   │   │   ├── useAnalyzeSymptoms.ts    # Analyze symptoms hook
│   │   │   ├── useChatHistory.ts        # Chat persistence hook
│   │   │   ├── useSpeechRecognition.ts  # Voice input hook
│   │   │   ├── useTextToSpeech.ts       # Voice output hook
│   │   │   └── useVoiceInput.ts         # Web Speech API wrapper
│   │   ├── components/
│   │   │   ├── AIChat.tsx               # Chat panel
│   │   │   ├── ChatPanel.tsx            # Legacy chat (deprecated)
│   │   │   ├── EmergencyBanner.tsx      # Emergency alerts
│   │   │   ├── VoiceInputButton.tsx     # Microphone button
│   │   │   ├── AILoadingIndicator.tsx   # Loading animation
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── PregnancyCheckScreen.tsx
│   │   │   ├── BodySelectionScreen.tsx
│   │   │   ├── SymptomSelectionScreen.tsx
│   │   │   └── ResultScreen.tsx
│   │   ├── utils/
│   │   │   ├── api.ts                   # API wrapper (deprecated, use services/api.ts)
│   │   │   ├── emergencyDetection.ts    # Emergency keyword detection
│   │   │   ├── i18n.ts                  # Translation helper
│   │   │   ├── resultEngine.ts          # Rule-based result generation
│   │   │   └── pdfGenerator.ts          # PDF export
│   │   ├── data/
│   │   │   ├── languages.ts             # Language data
│   │   │   ├── symptoms.ts              # Symptom data
│   │   │   ├── symptomTranslations.ts   # Symptom names by language
│   │   │   ├── symptomDictionary.ts     # Symptom examples
│   │   │   └── translations.ts          # UI translations
│   │   ├── __tests__/
│   │   │   ├── emergencyDetection.test.ts
│   │   │   ├── useChatHistory.test.ts
│   │   │   └── e2e.test.ts
│   │   ├── App.css
│   │   └── index.css
│   └── public/
```

### Key Configuration Files

**Backend:**
- `backend/.env` - Set `GEMINI_API_KEY=YOUR_KEY_HERE`
- `backend/requirements.txt` - Python dependencies

**Frontend:**
- `project/.env.local` - Set `VITE_API_URL=http://localhost:8000` (optional, defaults to localhost)
- `project/package.json` - npm/yarn dependencies
- `project/vite.config.ts` - Vite build configuration
- `project/tsconfig.json` - TypeScript configuration

---

## 🌐 Environment Variables

### Backend (`backend/.env`)

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Optional: Rate limit per minute (default: 60)
RATE_LIMIT_PER_MINUTE=60

# Optional: API port (default: 8000)
# PORT=8000

# Optional: Enable CORS for specific origins
# CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (`project/.env.local`)

```env
# Backend API URL (default: http://localhost:8000)
VITE_API_URL=http://localhost:8000

# Optional: Enable debug logging
# VITE_DEBUG=true
```

---

## 📦 Deployment

### Docker (Backend)

```dockerfile
# backend/Dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV GEMINI_API_KEY=$GEMINI_API_KEY
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Build & Run:**
```bash
docker build -t sakhi-backend .
docker run -e GEMINI_API_KEY=YOUR_KEY -p 8000:8000 sakhi-backend
```

### Deploy Backend to Cloud Run (Google Cloud)

```bash
# Authenticate with Google Cloud
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Deploy backend
cd backend
gcloud run deploy sakhi-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY \
  --allow-unauthenticated
```

### Deploy Frontend to Vercel/Netlify

```bash
# Using Vercel CLI
cd project
npm run build
vercel --env VITE_API_URL=https://sakhi-backend-xxx.run.app

# Using Netlify CLI
netlify deploy --prod --dir=dist
```

---

## 🔒 Security Notes

### ⚠️ DO NOT

- Commit `.env` files with real API keys
- Expose `GEMINI_API_KEY` in frontend code or repository
- Use hardcoded secrets

### ✅ DO

- Use environment variables for all secrets
- Rotate API keys regularly
- Monitor API usage and costs
- Use rate limiting (implemented in backend)
- Run backend behind HTTPS in production
- Use API gateway/WAF for production deployments
- Sanitize user inputs (implemented in backend)

### API Key Security

The backend validates the API key on startup:
- If missing → Server returns 500 error
- If invalid → Gemini API rejects requests
- Rate limiting prevents abuse (60 requests/minute by default)

---

## 🐛 Troubleshooting

### Backend Issues

**Error: "GEMINI_API_KEY not set"**
- Solution: Add `GEMINI_API_KEY=YOUR_KEY` to `backend/.env`

**Error: "Address already in use"**
- Solution: Change port: `uvicorn app:app --port 8001`

**Error: "Failed to import google-generativeai"**
- Solution: `pip install google-generativeai`

### Frontend Issues

**Error: "Network error: backend unreachable"**
- Solution: Ensure backend is running at `http://localhost:8000`
- Check `VITE_API_URL` in `project/.env.local`
- Enable CORS in backend if needed

**Error: "Voice input not working"**
- Solution: Check browser compatibility (Chrome, Edge, Safari 15+)
- Verify microphone permissions
- Fallback to text input if unsupported

**Error: "Tests failing"**
- Solution: `npm run test -- --reporter=verbose`
- Check test file paths and imports

### Gemini API Issues

**Error: "quota_exceeded"**
- Solution: You've exceeded free tier limits
- Upgrade to paid plan or request increase

**Error: "invalid_request"**
- Solution: Check prompt formatting
- Verify language is supported

---

## 📚 API Documentation

### Request/Response Examples

#### Symptom Analysis

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "मुझे पेट दर्द है",
    "language": "hi",
    "pregnant": false
  }'
```

#### Chat Message

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "क्या मुझे डॉक्टर के पास जाना चाहिए?",
    "history": [],
    "language": "hi",
    "pregnant": false
  }'
```

---

## 🤝 Contributing

### Setup Development Environment

```bash
# Clone repo
git clone https://github.com/Saisha23/SakhiAI.git
cd SakhiAI

# Backend development
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt

# Frontend development
cd ../project
npm install

# Run tests
npm run test

# Format code
npm run lint
```

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Write TypeScript (no `any` types without justification)
- Add tests for new features
- Document API changes

---

## 📄 License

This project is open source under the MIT License.

---

## 🙋 Support

- **Issues**: [GitHub Issues](https://github.com/Saisha23/SakhiAI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Saisha23/SakhiAI/discussions)
- **Email**: support@sakhi-ai.com (if applicable)

---

## 🎯 Roadmap

- [ ] User accounts & medical history tracking
- [ ] Telemedicine integration
- [ ] Offline mode with sync
- [ ] Advanced scheduling & reminders
- [ ] Integration with health wearables
- [ ] Doctor portal for remote consultations
- [ ] Prescription management
- [ ] Medicine reminders & drug interactions checker

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User (Browser)                       │
│  (React + TypeScript + Vite)                            │
│  ├─ HomeScreen                                          │
│  ├─ PregnancyCheckScreen                                │
│  ├─ BodySelectionScreen                                 │
│  ├─ SymptomSelectionScreen (with voice input)           │
│  ├─ ResultScreen (with emergency banner & chat)         │
│  └─ AIChat (with voice output & localStorage)           │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP REST
                       │ POST /analyze
                       │ POST /chat
                       │ GET /health
                       ▼
┌──────────────────────────────────────────────────────────┐
│                  FastAPI Backend                         │
│  (Python + Uvicorn)                                      │
│  ├─ CORS Middleware                                      │
│  ├─ Rate Limiting Middleware                             │
│  └─ Routes: /analyze, /chat, /health                    │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Language   │ │   Gemini     │ │     Risk     │
│  Detection   │ │   Service    │ │   Engine     │
│              │ │              │ │              │
│ • Detect     │ │ • Analyze    │ │ • Hybrid     │
│   language   │ │   symptoms   │ │   assessment │
│ • Normalize  │ │ • Chat       │ │ • Emergency  │
│   to API     │ │ • Parse JSON │ │   detection  │
└──────────────┘ └──────────────┘ └──────────────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │    Report Service            │
        │  • Generate structured       │
        │    report JSON               │
        │  • Compose explanation       │
        │  • Compile recommendations   │
        └──────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │     Response to Frontend     │
        │  {                           │
        │    "symptoms": [...],        │
        │    "severity": "...",        │
        │    "risk_level": "...",      │
        │    "report": "...",          │
        │    ...                       │
        │  }                           │
        └──────────────────────────────┘
```

---

## 📞 Contact & Credits

**Developer**: Your Name  
**Organization**: SakhiAI Team  
**Website**: https://sakhi-ai.com (if applicable)

---

**Last Updated**: June 2026  
**Version**: 1.0.0
