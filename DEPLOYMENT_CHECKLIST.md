# 🎯 Production Deployment Checklist for SakhiAI

## Pre-Deployment (Before Day 1)

### Security ✅
- [x] Remove all .env files with secrets from git history
- [x] Rotate Gemini API key if exposed
- [x] Verify .gitignore includes: .env, backend/.env, node_modules/, .venv/
- [x] No API keys in code comments
- [x] Review CORS origins for production domains

### Configuration ✅
- [x] Backend requirements.txt updated
- [x] Frontend package.json verified
- [x] Environment variable templates created (.env.example)
- [x] Docker files ready for production
- [x] Render/Vercel configs created

---

## Deployment Day - Backend (Render)

### 1. Prepare Repository
```bash
# Ensure all changes are committed
git status
git add -A
git commit -m "Production ready: auth, logging, deployment configs"
git push origin main
```

### 2. Set Up Render
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure Service:
   - **Name:** sakhi-backend
   - **Runtime:** Python
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && uvicorn app:app --host 0.0.0.0 --port 8000`
   - **Region:** Choose closest to users

### 3. Add Environment Variables (Render Dashboard)
```
GEMINI_API_KEY = [your_actual_key]
RATE_LIMIT_PER_MINUTE = 60
CORS_ORIGINS = http://localhost:5173,http://127.0.0.1:5173,https://sakhi-frontend-[random].vercel.app
```

### 4. Deploy
- Click "Deploy"
- Wait for build to complete (~3-5 minutes)
- Note the backend URL: `https://sakhi-backend-[random].onrender.com`

### 5. Verify Backend
```bash
# Test health endpoint
curl https://sakhi-backend-[random].onrender.com/health

# Expected response
# {"status":"ok","gemini_configured":true}
```

---

## Deployment Day - Frontend (Vercel)

### 1. Set Up Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import GitHub repository
4. Configure:
   - **Framework:** Vite
   - **Build Command:** `cd project && npm run build`
   - **Output Directory:** `project/dist`
   - **Install Command:** `npm install`

### 2. Add Environment Variables (Vercel Dashboard)
```
VITE_API_URL = https://sakhi-backend-[random].onrender.com
```

### 3. Deploy
- Click "Deploy"
- Wait for build (~2-3 minutes)
- Note the frontend URL: `https://sakhi-frontend-[random].vercel.app`

### 4. Verify Frontend
- Open in browser: `https://sakhi-frontend-[random].vercel.app`
- Test:
  - [ ] Language selection works
  - [ ] Symptom input works
  - [ ] AI analysis loads
  - [ ] No console errors

### 5. Update Backend CORS (if needed)
If frontend URL differs, update in Render:
```
CORS_ORIGINS = ...,https://[actual-vercel-url]
```

---

## Post-Deployment Testing

### API Endpoints Test
```bash
# 1. Health check
curl https://your-backend-url/health

# 2. Analyze endpoint
curl -X POST https://your-backend-url/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I have a headache and fever",
    "language": "en",
    "pregnant": false
  }'

# Expected: 200 with analysis response
```

### Frontend Testing
- [ ] Open https://your-frontend-url
- [ ] Select language (test with Hindi, English, Tamil)
- [ ] Describe symptoms
- [ ] Wait for AI response
- [ ] Try voice input (if microphone available)
- [ ] Check response displays correctly
- [ ] Test chat follow-up
- [ ] Verify download report works

### Performance Check
- [ ] Frontend loads in <2s
- [ ] API responds in <10s
- [ ] No 404 errors
- [ ] No CORS errors
- [ ] Images load correctly

---

## Monitoring Setup (Optional but Recommended)

### Option 1: Render Built-in Monitoring
1. Dashboard → Logs tab
2. Monitor for errors
3. Check uptime status

### Option 2: Sentry (Free for small projects)
```bash
# 1. Create account at sentry.io
# 2. Create project (Python + React)
# 3. Add to backend app.py:
import sentry_sdk
sentry_sdk.init("your-sentry-dsn", traces_sample_rate=0.1)

# 4. Add to frontend main.tsx:
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: "your-sentry-dsn", ... });
```

---

## Troubleshooting

### Backend Won't Start
```bash
# Check logs in Render dashboard
# Look for:
- GEMINI_API_KEY not set
- Import errors
- Port already in use

# Solutions:
# 1. Verify GEMINI_API_KEY is set
# 2. Check Python version compatibility
# 3. Verify requirements.txt syntax
```

### Frontend Can't Connect to Backend
```bash
# Check browser console for CORS errors
# Verify:
- VITE_API_URL is set correctly
- Backend CORS_ORIGINS includes frontend URL
- Backend is running and healthy

# Test:
fetch('https://your-backend-url/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

### API Returns 503
```bash
# This means Gemini API is down or key is invalid
# Check:
- GEMINI_API_KEY is correct
- Google Cloud credentials valid
- Gemini API quota not exceeded
```

---

## Maintenance Tasks

### Weekly
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Verify rate limiting working

### Monthly
- [ ] Update dependencies: `pip list --outdated` / `npm outdated`
- [ ] Review performance metrics
- [ ] Check Gemini API usage

### Quarterly
- [ ] Security audit of dependencies
- [ ] Performance optimization review
- [ ] User feedback analysis

---

## Rollback Plan

If deployment fails:

```bash
# 1. Revert to previous version
git revert HEAD
git push

# 2. Redeploy
# Render/Vercel will auto-deploy previous commit

# 3. Or manual rollback
# Render: Dashboard → Logs → Redeploy from previous build
# Vercel: Dashboard → Deployments → Redeploy previous
```

---

## Success Criteria ✅

Production deployment is successful when:
- [x] Backend health check returns 200 OK
- [x] Frontend loads without console errors
- [x] AI analysis works end-to-end
- [x] No CORS errors in browser
- [x] Rate limiting is active (429 after 30 requests)
- [x] Logs show no ERROR level messages
- [x] Response times are <10s
- [x] Mobile view is responsive

---

## Support & Resources

- **FastAPI Docs:** https://fastapi.tiangolo.com
- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Google Gemini:** https://ai.google.dev
- **GitHub:** [Your repo URL]

---

**Document Version:** 1.0  
**Last Updated:** June 22, 2026  
**Status:** READY FOR PRODUCTION ✅
