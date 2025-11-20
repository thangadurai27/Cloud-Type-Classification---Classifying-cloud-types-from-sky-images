"""
🌤️ Cloud Classification API Backend
FastAPI server for cloud type classification with mock responses
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import random
import time
import asyncio
import os
from typing import Dict, Any

# Initialize FastAPI app
app = FastAPI(
    title="Cloud Classification API",
    description="AI-powered cloud type classification system",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "http://127.0.0.1:3000",
        "https://cloud-type-classification-classifyi-tan.vercel.app",  # Your Vercel domain
        "https://*.vercel.app",  # All Vercel domains
        "*"  # Allow all origins for initial testing - restrict in production
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Cloud types from the dataset with comprehensive information
CLOUD_TYPES = [
    {
        "name": "Cumulonimbus",
        "abbreviation": "Cb",
        "description": "Towering storm clouds that can reach extreme heights",
        "weather_significance": "Indicates thunderstorms, heavy rain, hail, and severe weather",
        "altitude": "Surface to 60,000+ ft",
        "appearance": "Towering, anvil-shaped top, dark base"
    },
    {
        "name": "Cumulus",
        "abbreviation": "Cu",
        "description": "Puffy, cotton-like clouds with flat bases and rounded tops",
        "weather_significance": "Fair weather indicator, pleasant conditions",
        "altitude": "1,600-6,500 ft",
        "appearance": "Fluffy, white, well-defined edges"
    },
    {
        "name": "Stratus",
        "abbreviation": "St",
        "description": "Low, gray clouds that often cover the entire sky like a blanket",
        "weather_significance": "Overcast conditions, possible light rain or drizzle",
        "altitude": "0-2,000 ft",
        "appearance": "Uniform gray layer, featureless"
    },
    {
        "name": "Cirrus",
        "abbreviation": "Ci",
        "description": "Thin, wispy high clouds made of ice crystals",
        "weather_significance": "Fair weather, but may indicate weather change in 24-48 hours",
        "altitude": "20,000-45,000 ft",
        "appearance": "Feathery, hair-like, translucent"
    },
    {
        "name": "Altocumulus",
        "abbreviation": "Ac",
        "description": "Mid-level clouds with gray or white patches, often in waves or bands",
        "weather_significance": "May indicate thunderstorms developing later in the day",
        "altitude": "6,500-20,000 ft",
        "appearance": "Gray/white patches or layers, wave-like patterns"
    },
    {
        "name": "Altostratus",
        "abbreviation": "As",
        "description": "Mid-level gray or blue-gray sheets that often cover the entire sky",
        "weather_significance": "Rain or snow likely within 24 hours",
        "altitude": "6,500-20,000 ft",
        "appearance": "Gray/blue sheet, sun dimly visible"
    },
    {
        "name": "Stratocumulus",
        "abbreviation": "Sc",
        "description": "Low, lumpy gray or white patches arranged in rows or groups",
        "weather_significance": "Usually dry, but may produce light rain",
        "altitude": "0-6,500 ft",
        "appearance": "Low rolls or patches, gray/white with darker areas"
    },
    {
        "name": "Nimbostratus",
        "abbreviation": "Ns",
        "description": "Dark, thick clouds that produce steady rain or snow",
        "weather_significance": "Continuous precipitation expected",
        "altitude": "0-10,000 ft",
        "appearance": "Dark gray, thick layer, precipitation falling"
    },
    {
        "name": "Cirrostratus",
        "abbreviation": "Cs",
        "description": "Thin, sheet-like high clouds that often cover the entire sky",
        "weather_significance": "Weather change approaching within 24 hours",
        "altitude": "20,000-45,000 ft",
        "appearance": "Thin white sheet, creates halo around sun/moon"
    },
    {
        "name": "Cirrocumulus",
        "abbreviation": "Cc",
        "description": "High, thin clouds arranged in rows of small white patches",
        "weather_significance": "Fair weather, but may indicate approaching weather change",
        "altitude": "20,000-45,000 ft",
        "appearance": "Small white patches in rows, 'mackerel sky'"
    },
    {
        "name": "Contrail",
        "abbreviation": "Ct",
        "description": "Man-made clouds formed by aircraft exhaust in the atmosphere",
        "weather_significance": "Indicates atmospheric conditions, not natural weather predictor",
        "altitude": "26,000-40,000 ft",
        "appearance": "Linear white trails behind aircraft"
    }
]

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "🌤️ Cloud Classification API",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "predict": "/predict-cloud"
        }
    }

@app.get("/health")
async def health_check():
    """Comprehensive health check endpoint"""
    return {
        "status": "healthy",
        "message": "Cloud Classification API is running",
        "timestamp": int(time.time()),
        "version": "1.0.0",
        "uptime": "active",
        "endpoints": {
            "health": "/health",
            "predict": "/predict-cloud",
            "docs": "/docs",
            "ping": "/ping"
        },
        "supported_formats": ["jpeg", "jpg", "png", "gif", "webp"],
        "max_file_size": "10MB"
    }

@app.get("/ping")
async def ping():
    """Simple ping endpoint for monitoring"""
    return {"ping": "pong", "timestamp": int(time.time())}

@app.post("/predict-cloud")
async def predict_cloud_type(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Predict cloud type from uploaded image
    
    Args:
        file: Uploaded image file
        
    Returns:
        Dictionary with prediction results
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail="File must be an image (jpeg, png, gif, webp, etc.)"
            )
        
        # Read file content (in real implementation, this would go to ML model)
        contents = await file.read()
        
        if len(contents) == 0:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty"
            )
            
        # Check file size (limit to 10MB)
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="File too large. Maximum size is 10MB"
            )
        
        # Simulate processing time
        processing_start = time.time()
        await simulate_processing()
        processing_time = time.time() - processing_start
        
        # Generate mock prediction (replace with real ML model)
        predicted_cloud = random.choice(CLOUD_TYPES)
        confidence = round(random.uniform(0.75, 0.98), 3)
        
        # Create comprehensive response
        response = {
            "success": True,
            "cloud_type": predicted_cloud["name"],
            "abbreviation": predicted_cloud["abbreviation"],
            "confidence": confidence,
            "description": predicted_cloud["description"],
            "weather_significance": predicted_cloud["weather_significance"],
            "altitude": predicted_cloud["altitude"],
            "appearance": predicted_cloud["appearance"],
            "processing_time": round(processing_time, 3),
            "file_info": {
                "filename": file.filename,
                "content_type": file.content_type,
                "size_kb": round(len(contents) / 1024, 2)
            },
            "metadata": {
                "model_version": "1.0.0",
                "timestamp": int(time.time()),
                "api_version": "2024-11-20"
            }
        }
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

async def simulate_processing():
    """Simulate ML model processing time"""
    # Simulate realistic processing time (0.5-3 seconds)
    await asyncio.sleep(random.uniform(0.5, 3.0))

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not Found",
            "message": "The requested endpoint was not found",
            "available_endpoints": ["/", "/health", "/predict-cloud"]
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred"
        }
    )

# Import asyncio for simulate_processing
import asyncio

if __name__ == "__main__":
    print("🌤️  Starting Cloud Classification API...")
    print("📡 CORS enabled for Vercel and localhost")
    print("🔗 API will be available at: http://localhost:8000")
    print("💚 Health check: http://localhost:8000/health")
    print("📤 Upload endpoint: http://localhost:8000/predict-cloud")
    print("📚 API docs: http://localhost:8000/docs")
    print()
    
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,  # Set to False for production
        log_level="info"
    )