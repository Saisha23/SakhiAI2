# 🚀 SakhiAI Production Deployment Checklist

## Pre-Deployment Verification

### Security ✅
- [x] .env files are gitignored
- [x] No API keys in source code
- [x] No sensitive data in localStorage (chat history is ephemeral)
- [x] CORS is properly configured
- [x] Rate limiting is enabled (30 req/min)
- [x] Input validation with Pydantic
- [x] Request sanitization for user inputs
- [x] Error messages don't leak sensitive info

### Backend ✅
- [x] Health check endpoint (/health)
- [x] Gemini API key validation
- [x] Error handling for Gemini failures
- [x] Fallback strategy when API unavailable
- [x] Logging configured (INFO level)
- [x] Request/response logging middleware
- [x] Rate limiting middleware
- [x] CORS middleware configured
- [x] Exception handlers for all error types
- [x] Tests created (run with pytest)

### Frontend ✅
- [x] Mobile responsive (480px max-width)
- [x] Voice input support (Web Speech API)
- [x] Text-to-speech support (Speech Synthesis)
- [x] 16 language support
- [x] Loading indicators
- [x] Error boundary / error handling
- [x] API timeout handling (30s)
- [x] Network error messages
- [x] Environment variables configurable
- [x] Build optimization with Vite

### Deployment Configs ✅
- [x] Vercel configuration (vercel.json)
- [x] Render configuration (render.yaml)
- [x] Netlify configuration (netlify.toml)
- [x] Docker configuration (Dockerfile + docker-compose.yml)
- [x] Environment variable documentation

---

## Deployment Instructions

### Option 1: Render (Recommended for Backend)

**Backend:**
1. Push code to GitHub
2. Go to https://render.com
3. Create new "Web Service" → Connect GitHub repo
4. Set Runtime: Python
5. Set Build Command: `pip install -r backend/requirements.txt`
6. Set Start Command: `cd backend && uvicorn app:app --host 0.0.0.0 --port 8000`
7. Add Environment Variables:
   - `GEMINI_API_KEY`: Your API key
   - `CORS_ORIGINS`: Add your frontend URL
8. Deploy

**Backend URL:** `https://sakhi-backend-[random].onrender.com`

### Option 2: Vercel (Recommended for Frontend)

**Frontend:**
1. Push code to GitHub (or connect repo)
2. Go to https://vercel.com
3. Create new project → Import GitHub repo
4. Framework: Vite
5. Build Command: `cd project && npm run build`
6. Output Directory: `project/dist`
7. Add Environment Variables:
   - `VITE_API_URL`: Your backend URL (e.g., `https://sakhi-backend-[random].onrender.com`)
8. Deploy

**Frontend URL:** `https://sakhi-ai-[random].vercel.app`

### Option 3: Docker Compose (Local/Self-Hosted)

```bash
# Create .env file with your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env

# Start both services
docker-compose up
```

Access at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

---

## Post-Deployment Testing

```bash
# 1. Test backend health
curl https://your-backend-url.com/health

# Expected response:
# {"status":"ok","gemini_configured":true}

# 2. Test analyze endpoint
curl -X POST https://your-backend-url.com/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"I have a headache","pregnant":false}'

# 3. Test frontend
# Open https://your-frontend-url.com in browser
# - Select language
# - Describe symptoms
# - Verify response loads
```

---

## Monitoring & Maintenance

### Logs
- **Render Backend:** Dashboard → Logs
- **Vercel Frontend:** Dashboard → Functions/Deployments

### Health Checks
- Backend has automatic health checks
- Monitor Gemini API quota in Google Cloud Console
- Set up alerts for error rates

### Rate Limiting
- Current: 30 requests/minute per IP
- Adjust in `backend/app.py` or environment: `RATE_LIMIT_PER_MINUTE=60`

### Performance
- Frontend: ~50KB gzipped (Vite optimized)
- Backend: Startup ~2s with Gemini check
- API Response: 2-10s (Gemini response time)

---

## Environment Variables Reference

### Backend (`backend/.env`)
```
GEMINI_API_KEY=your_api_key           # Required
RATE_LIMIT_PER_MINUTE=30              # Optional (default: 30)
CORS_ORIGINS=http://localhost:5173    # Optional (comma-separated)
```

### Frontend (`project/.env.local`)
```
VITE_API_URL=http://localhost:8000    # Optional (default: localhost:8000)
```

---

## Troubleshooting

### Backend Won't Start
```bash
# Check Gemini API key
echo $GEMINI_API_KEY

# Test in Python
python
>>> import os; os.getenv('GEMINI_API_KEY')

# Check port availability
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows
```

### Frontend Can't Connect to Backend
```bash
# Check CORS settings
curl -i -X OPTIONS https://backend-url.com/health

# Check that backend URL is correct
console.log(import.meta.env.VITE_API_URL)

# Test API endpoint directly
fetch('https://your-backend-url/health')
```

### Rate Limit Exceeded
- Wait 60 seconds
- Increase `RATE_LIMIT_PER_MINUTE` if needed
- Implement request caching on frontend

---

## Security Checklist

- [ ] Gemini API key is secret (not in .env)
- [ ] CORS is restricted to your frontend domain
- [ ] HTTPS is enforced (both Render and Vercel use HTTPS)
- [ ] Rate limiting is enabled
- [ ] Error messages don't leak sensitive info
- [ ] Regular security updates for dependencies
- [ ] Database credentials are never logged

---

## Performance Optimization

### Frontend
- Vite build: ~2.5MB → ~50KB gzipped
- Lazy load screens as needed
- Cache language data locally
- Minimize re-renders with React.memo

### Backend
- Cache language detection results
- Connection pooling for Gemini API
- Consider Redis for rate limiting at scale
- Monitor Gemini token usage

---

## Next Steps

1. **Set up monitoring:** Use Render/Vercel built-in monitoring
2. **Configure backups:** Set up database backups if persistent storage added
3. **Plan scaling:** Use CDN for frontend, implement caching for backend
4. **Community feedback:** Monitor error logs and user feedback

---

## Support & Resources

- FastAPI Docs: https://fastapi.tiangolo.com
- Google Gemini: https://ai.google.dev
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- SakhiAI GitHub: [your-repo-url]
