# 🚀 SakhiAI - Complete Setup & Deployment Instructions

**Status**: ✅ All files created and configured  
**Date**: June 22, 2026  
**Next Step**: Follow these instructions to run the application

---

## ⚡ 30-Second Overview

SakhiAI is an AI-powered women's health assistant that:
- Analyzes symptoms using Google Gemini API
- Provides risk assessments
- Enables voice input/output
- Detects emergencies
- Supports 16 Indian languages
- Runs on React + FastAPI stack

---

## 🔑 Step 0: Get Your Gemini API Key

1. Visit https://aistudio.google.com/app/apikey
2. Click "Create API key"
3. Copy the key (you'll need it in Step 1)
4. Keep it safe! ⚠️

---

## 🖥️ Step 1: Setup Backend

### 1.1 Open Terminal/PowerShell

```bash
# Navigate to project root
cd SakhiAI-main
cd backend
```

### 1.2 Create Virtual Environment

```bash
# On Windows:
python -m venv .venv
.venv\Scripts\activate

# On macOS/Linux:
python3 -m venv .venv
source .venv/bin/activate
```

### 1.3 Install Dependencies

```bash
pip install -r requirements.txt
```

### 1.4 Add Your Gemini API Key

```bash
# Create .env file with your key
# On Windows:
echo GEMINI_API_KEY=YOUR_KEY_HERE > .env

# On macOS/Linux:
echo "GEMINI_API_KEY=YOUR_KEY_HERE" > .env
```

**Replace `YOUR_KEY_HERE` with your actual Gemini API key!**

### 1.5 Start Backend Server

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

✅ **Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Press CTRL+C to quit
```

✅ **Verify** by opening: http://localhost:8000/docs

---

## 💻 Step 2: Setup Frontend

### 2.1 Open NEW Terminal/PowerShell (keep backend running!)

```bash
# Navigate to frontend directory
cd SakhiAI-main
cd project
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Create Optional Config File

```bash
# This step is optional (defaults to localhost:8000)
# On Windows:
echo VITE_API_URL=http://localhost:8000 > .env.local

# On macOS/Linux:
echo "VITE_API_URL=http://localhost:8000" > .env.local
```

### 2.4 Start Frontend Server

```bash
npm run dev
```

✅ **Expected Output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Press q + enter to quit
```

---

## 🌐 Step 3: Open Application

1. Open your web browser
2. Go to: **http://localhost:5173**
3. You should see SakhiAI homepage!

### Test the Full Flow:

1. **Select Language** → Choose any language (or "Auto")
2. **Indicate Pregnancy** → Yes/No
3. **Select Body Part** → Choose one
4. **Describe Symptoms** → Type or use voice 🎤
5. **Submit** → Get AI-powered analysis ✅
6. **Chat** → Ask follow-up questions
7. **Listen** → Hear the report 🔊
8. **Download** → Save as PDF

---

## 🧪 Step 4: Run Tests (Optional)

### 4.1 In Frontend Terminal

```bash
npm run test
```

### 4.2 Run with Coverage

```bash
npm run test:coverage
```

### 4.3 Check Code Quality

```bash
npm run lint
```

---

## 🐳 Step 5: Deploy with Docker (Optional)

### 5.1 Build & Run Everything

```bash
# From project root
docker-compose up
```

### 5.2 Access Services

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### 5.3 Stop Services

```bash
docker-compose down
```

---

## 📤 Step 6: Commit to GitHub

### 6.1 Initialize Git (if not already)

```bash
cd SakhiAI-main
git init
git add .
git commit -m "Initial commit: Full AI-powered health assistant"
```

### 6.2 Add Remote Repository

```bash
git remote add origin https://github.com/Saisha23/SakhiAI.git
git branch -M main
git push -u origin main
```

### 6.3 Verify Files on GitHub

- Check that `.env` files are NOT uploaded (should be in .gitignore ✅)
- All source code is uploaded ✅
- Documentation is visible ✅

---

## ✅ Verification Checklist

Before considering setup complete, verify:

### Backend
- [ ] Terminal shows "Uvicorn running on http://0.0.0.0:8000"
- [ ] http://localhost:8000/health returns `{"status":"ok"}`
- [ ] http://localhost:8000/docs shows Swagger UI
- [ ] `backend/.env` exists with GEMINI_API_KEY

### Frontend
- [ ] Terminal shows "Local: http://localhost:5173"
- [ ] Browser shows SakhiAI homepage
- [ ] Language selector works
- [ ] Can select pregnancy status
- [ ] Can select body part

### Integration
- [ ] Submit symptoms → Analysis appears
- [ ] Emergency keywords trigger banner
- [ ] Chat works
- [ ] Voice input recognized (if supported)
- [ ] Report downloads as PDF

### Tests
- [ ] `npm run test` passes all tests
- [ ] Code style check passes

---

## 🆘 Troubleshooting

### Issue: "GEMINI_API_KEY not set"

**Solution:**
1. Check `backend/.env` exists
2. Verify it has: `GEMINI_API_KEY=YOUR_ACTUAL_KEY`
3. Restart backend: `uvicorn app:app --reload`

### Issue: "Port 8000 already in use"

**Solution:**
```bash
# Change port
uvicorn app:app --port 8001 --reload

# Update frontend
# In project/.env.local:
VITE_API_URL=http://localhost:8001
```

### Issue: "Cannot find module"

**Solution:**
```bash
# Reinstall dependencies
cd project
rm -rf node_modules
npm install
npm run dev
```

### Issue: "Network error: backend unreachable"

**Solution:**
1. Ensure backend is running: `http://localhost:8000/health`
2. Check `project/.env.local` has correct `VITE_API_URL`
3. Verify firewall isn't blocking localhost connections

### Issue: "Voice input not working"

**Solution:**
1. Check browser compatibility (Chrome, Edge, Safari 15+)
2. Grant microphone permissions
3. Try typing instead (voice input is optional)

---

## 📚 File Locations Reference

| File | Location | Purpose |
|------|----------|---------|
| **Gemini Key** | `backend/.env` | ⚠️ ADD YOUR KEY HERE |
| **Backend Config** | `backend/requirements.txt` | Dependencies |
| **Frontend Config** | `project/package.json` | Dependencies |
| **Test Config** | `project/vitest.config.ts` | Test settings |
| **Documentation** | `README.md` | Full guide |
| **Quick Guide** | `QUICKSTART.md` | 5-min setup |
| **Summary** | `IMPLEMENTATION_SUMMARY.md` | What was built |

---

## 🚢 Production Deployment

### Backend → Google Cloud Run

```bash
cd backend

# Authenticate
gcloud auth login

# Deploy
gcloud run deploy sakhi-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY \
  --allow-unauthenticated

# Get URL
gcloud run services describe sakhi-backend --region us-central1 --format="value(status.url)"
```

### Frontend → Vercel

```bash
cd project

# Build
npm run build

# Deploy
vercel deploy --prod \
  --env VITE_API_URL=https://sakhi-backend-xxx.run.app
```

---

## 📊 Key Endpoints

### POST /analyze
Analyze symptoms with AI

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I have fever and cough",
    "language": "en",
    "pregnant": false
  }'
```

### POST /chat
Chat with AI

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Should I see a doctor?",
    "history": [],
    "language": "en",
    "pregnant": false
  }'
```

### GET /health
Check backend status

```bash
curl http://localhost:8000/health
```

---

## 📱 Supported Languages

✅ English, Hindi, Tamil, Bengali, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Urdu, Assamese, Konkani, Manipuri, Sanskrit

---

## 🎯 What's Included

### Features Implemented
- ✅ AI-powered symptom analysis
- ✅ Emergency detection
- ✅ Voice input/output
- ✅ Multilingual support
- ✅ Chat assistant
- ✅ Report generation
- ✅ Clinic recommendations
- ✅ Mobile responsive
- ✅ Error handling
- ✅ Unit tests

### Files Created
- 34 new source files
- 13 modified files
- 4 documentation files
- 2 Docker files
- 1 git configuration

---

## 🎉 Success Indicators

You'll know setup is successful when:

1. ✅ Backend terminal shows "Uvicorn running"
2. ✅ Frontend terminal shows "Local: http://localhost:5173"
3. ✅ Browser homepage loads without errors
4. ✅ Can select symptoms and get AI analysis
5. ✅ API docs available at localhost:8000/docs
6. ✅ Tests pass: `npm run test`

---

## 🤝 Need Help?

1. **Check QUICKSTART.md** - 5-minute setup guide
2. **Read README.md** - Comprehensive documentation
3. **Review IMPLEMENTATION_SUMMARY.md** - What was built
4. **Check MANIFEST.md** - All files created/modified
5. **Review troubleshooting section above**

---

## 📞 Quick Links

- **Gemini API**: https://ai.google.dev/
- **FastAPI**: https://fastapi.tiangolo.com/
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **Docker**: https://docker.io/

---

## ⏱️ Typical Setup Time

- **Backend**: 5 minutes
- **Frontend**: 2 minutes
- **Testing**: 2 minutes
- **Total**: ~10 minutes

---

## 🔐 Important Security Notes

⚠️ **DO NOT:**
- Share your GEMINI_API_KEY with anyone
- Commit `.env` files to GitHub (protected by `.gitignore`)
- Use API key in frontend code
- Deploy without HTTPS in production

✅ **DO:**
- Keep API key in backend `.env`
- Rotate keys regularly
- Monitor API usage
- Use secret manager in production

---

## 🎓 Learning Resources

After setup, explore:
- `backend/services/gemini_service.py` - AI integration
- `backend/services/risk_engine.py` - Risk assessment logic
- `project/src/hooks/useAnalyzeSymptoms.ts` - React hooks
- `project/src/__tests__/` - Test examples

---

## 📋 Final Checklist

Before launching:
- [ ] GEMINI_API_KEY added to backend/.env
- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Tests passing
- [ ] Can analyze symptoms
- [ ] Can chat with AI
- [ ] Emergency detection working
- [ ] Voice features functional
- [ ] Code pushed to GitHub
- [ ] .env files are NOT committed

---

**Congratulations! 🎉 SakhiAI is ready to launch!**

Next step: Start backend, start frontend, open browser. Enjoy!

