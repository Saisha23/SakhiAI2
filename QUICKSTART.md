# SakhiAI - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js 16+
- Python 3.8+
- Google Gemini API Key (free)

### Step 1: Get Gemini API Key
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API key"
3. Copy the key

### Step 2: Setup Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate it
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo GEMINI_API_KEY=YOUR_KEY_HERE > .env

# Start backend
uvicorn app:app --reload --port 8000
```

**Backend running at:** `http://localhost:8000`

### Step 3: Setup Frontend

```bash
# In new terminal, navigate to frontend
cd project

# Install dependencies
npm install

# Create .env.local (optional, defaults to localhost:8000)
echo VITE_API_URL=http://localhost:8000 > .env.local

# Start frontend
npm run dev
```

**Frontend running at:** `http://localhost:5173`

### Step 4: Open Browser
1. Go to `http://localhost:5173`
2. Select language
3. Indicate pregnancy (optional)
4. Select body part or describe symptoms
5. Get AI analysis
6. Chat with AI
7. Download report

---

## 🐳 Using Docker (One Command)

```bash
# Make sure GEMINI_API_KEY is in shell
export GEMINI_API_KEY=your_key_here

# Or create .env file in project root
echo GEMINI_API_KEY=your_key_here > .env

# Start everything
docker-compose up
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

---

## 📁 Important Files

### You MUST Edit
- `backend/.env` → Add `GEMINI_API_KEY=YOUR_KEY`
- `project/.env.local` → Optional, set backend URL if not localhost:8000

### Do NOT Commit (Already in .gitignore)
- `.env` files with real keys
- `node_modules/`
- `.venv/` and `__pycache__/`

---

## ✅ Verify Setup

### Backend Health
```bash
curl http://localhost:8000/health
# Response: {"status":"ok"}
```

### API Documentation
```
http://localhost:8000/docs
```

### Test Analysis
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I have abdominal pain",
    "language": "en",
    "pregnant": false
  }'
```

---

## 🧪 Running Tests

```bash
cd project
npm run test                    # Run tests
npm run test:coverage          # With coverage report
npm run lint                   # Check code style
```

---

## 🚢 Deploy to Production

### Backend → Google Cloud Run
```bash
cd backend
gcloud run deploy sakhi-backend \
  --source . \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY
```

### Frontend → Vercel/Netlify
```bash
cd project
npm run build
vercel deploy --prod
```

---

## 🆘 Troubleshooting

### "GEMINI_API_KEY not set"
→ Edit `backend/.env` and add your key

### "Network error: backend unreachable"
→ Ensure backend is running on port 8000  
→ Check `project/.env.local` has correct `VITE_API_URL`

### "Voice input not working"
→ Check browser compatibility (Chrome, Edge, Safari 15+)  
→ Verify microphone permissions

### "Port 8000 already in use"
→ `uvicorn app:app --port 8001`

---

## 📚 Learn More

- Full README: `./README.md`
- Architecture: `./README.md#-architecture`
- API Docs: `http://localhost:8000/docs`
- Environment Setup: `./README.md#-environment-variables`

---

**Happy Coding! 🎉**
