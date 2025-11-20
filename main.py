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
    Predict cloud type from uploaded image with enhanced error handling
    
    Args:
        file: Uploaded image file
        
    Returns:
        Dictionary with prediction results
    """
    try:
        # Log incoming request for debugging
        print(f"📤 Received file upload: {file.filename}")
        print(f"📋 Content-Type: {file.content_type}")
        print(f"📊 File object type: {type(file)}")
        
        # Check if file was actually uploaded
        if not file or not file.filename:
            print("❌ No file uploaded")
            raise HTTPException(
                status_code=400,
                detail="No file uploaded. Please select an image file."
            )
        
        # Read file content first to get size
        try:
            contents = await file.read()
            file_size = len(contents)
            print(f"📁 File size: {file_size} bytes ({file_size/1024:.1f} KB)")
        except Exception as read_error:
            print(f"❌ Error reading file: {str(read_error)}")
            raise HTTPException(
                status_code=400,
                detail=f"Error reading uploaded file: {str(read_error)}"
            )
        
        # Check if file is empty
        if file_size == 0:
            print("❌ Empty file uploaded")
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty. Please select a valid image file."
            )
            
        # Check file size (limit to 10MB)
        if file_size > 10 * 1024 * 1024:
            print(f"❌ File too large: {file_size/1024/1024:.1f}MB")
            raise HTTPException(
                status_code=400,
                detail=f"File too large: {file_size/1024/1024:.1f}MB. Maximum size is 10MB."
            )
        
        # Validate file type - be more flexible with content-type checking
        is_valid_image = False
        
        # Check content type if available
        if file.content_type and file.content_type.startswith('image/'):
            is_valid_image = True
            print(f"✅ Valid content-type: {file.content_type}")
        
        # Check file extension as fallback
        if not is_valid_image and file.filename:
            valid_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp')
            if file.filename.lower().endswith(valid_extensions):
                is_valid_image = True
                print(f"✅ Valid file extension: {file.filename}")
        
        if not is_valid_image:
            print(f"❌ Invalid file type: {file.content_type}, filename: {file.filename}")
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Please upload an image file (JPG, PNG, GIF, etc.). Received: {file.content_type}"
            )
        
        # Simulate processing time
        print("🔄 Processing image...")
        processing_start = time.time()
        await simulate_processing()
        processing_time = time.time() - processing_start
        print(f"⏱️ Processing completed in {processing_time:.2f} seconds")
        
        # Generate mock prediction (replace with real ML model)
        predicted_cloud = random.choice(CLOUD_TYPES)
        confidence = round(random.uniform(0.75, 0.98), 3)
        
        print(f"🎯 Prediction: {predicted_cloud['name']} ({confidence*100:.1f}% confidence)")
        
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
                "content_type": file.content_type or "unknown",
                "size_kb": round(file_size / 1024, 2),
                "size_bytes": file_size
            },
            "metadata": {
                "model_version": "1.0.0",
                "timestamp": int(time.time()),
                "api_version": "2024-11-20",
                "server_status": "active"
            }
        }
        
        print("✅ Response created successfully")
        return response
        
    except HTTPException as he:
        print(f"❌ HTTP Exception: {he.status_code} - {he.detail}")
        raise he
    except Exception as e:
        print(f"💥 Unexpected error: {str(e)}")
        print(f"🔍 Error type: {type(e).__name__}")
        import traceback
        print(f"📜 Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error during prediction: {str(e)}"
        )

async def simulate_processing():
    """Simulate ML model processing time with realistic delay"""
    try:
        # Simulate realistic processing time (0.5-2 seconds for demo)
        processing_time = random.uniform(0.5, 2.0)
        print(f"⏳ Simulating processing for {processing_time:.1f} seconds...")
        await asyncio.sleep(processing_time)
        print("✅ Processing simulation completed")
    except Exception as e:
        print(f"⚠️ Error in processing simulation: {str(e)}")
        # Don't fail the whole request if simulation fails
        pass

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