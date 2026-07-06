"""SakhiAI FastAPI backend — Gemini-powered health analysis."""

import os
import time
import logging
from collections import defaultdict
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routes.analyze import router as analyze_router
from services.language_service import list_supported
from services.gemini_service import GeminiServiceError

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

RATE_LIMIT = int(os.getenv("RATE_LIMIT_PER_MINUTE", "30"))
_rate_store: dict[str, list[float]] = defaultdict(list)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key:
        logger.warning("GEMINI_API_KEY not set — API calls will fail until configured")
    else:
        logger.info("SakhiAI backend started with Gemini integration")
    yield
    # Shutdown
    logger.info("SakhiAI backend shutting down")


app = FastAPI(
    title="SakhiAI API",
    description="AI-powered women's health companion for India",
    version="2.0.0",
    lifespan=lifespan,
)

ALLOWED_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,https://sakhi-frontend.vercel.app",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info(f"CORS allowed origins: {ALLOWED_ORIGINS}")


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Exempt health and docs endpoints
    if request.url.path in ("/health", "/languages", "/docs", "/openapi.json", "/redoc"):
        return await call_next(request)

    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    window_start = now - 60
    _rate_store[client_ip] = [t for t in _rate_store[client_ip] if t > window_start]

    if len(_rate_store[client_ip]) >= RATE_LIMIT:
        logger.warning(f"Rate limit exceeded for {client_ip}")
        return JSONResponse(
            status_code=429,
            content={"detail": "Rate limit exceeded. Please try again in a minute."},
        )

    _rate_store[client_ip].append(now)
    return await call_next(request)


@app.middleware("http")
async def request_logging_middleware(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url.path}")
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"Response: {response.status_code} (took {process_time:.3f}s)")
    return response


@app.get("/health")
async def health():
    has_key = bool(os.getenv("GEMINI_API_KEY", "").strip())
    return {"status": "ok", "gemini_configured": has_key}


@app.get("/languages")
async def languages():
    return {"languages": list_supported()}


app.include_router(analyze_router)


@app.exception_handler(GeminiServiceError)
async def gemini_error_handler(request: Request, exc: GeminiServiceError):
    logger.error(f"Gemini service error: {exc}")
    return JSONResponse(status_code=503, content={"detail": str(exc)})


@app.exception_handler(Exception)
async def general_error_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal error occurred. Please try again later."}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
