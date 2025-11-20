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
from typing import Dict, Any

# Initialize FastAPI app
app = FastAPI(
    title="Cloud Classification API",
    description="API for classifying cloud types from images",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React development server
        "http://127.0.0.1:3000",
        "http://localhost:5173",  # Vite development server
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Cloud types from the dataset
CLOUD_TYPES = [
    "Altocumulus", "Altostratus", "Cirrocumulus", "Cirrostratus", "Cirrus",
    "Cumulonimbus", "Cumulus", "Nimbostratus", "Stratocumulus", "Stratus", "Contrail"
]

# Cloud descriptions for mock responses
CLOUD_DESCRIPTIONS = {
    "Altocumulus": "Mid-level clouds with gray or white patches, often in waves or bands",
    "Altostratus": "Mid-level gray or blue-gray sheets that often cover the entire sky",
    "Cirrocumulus": "High, thin clouds arranged in rows of small white patches",
    "Cirrostratus": "Thin, sheet-like high clouds that often cover the entire sky",
    "Cirrus": "Thin, wispy high clouds made of ice crystals",
    "Cumulonimbus": "Towering clouds that produce thunderstorms and severe weather",
    "Cumulus": "Puffy, cotton-like clouds with flat bases and rounded tops",
    "Nimbostratus": "Dark, thick clouds that produce steady rain or snow",
    "Stratocumulus": "Low, lumpy gray or white patches arranged in rows or groups",
    "Stratus": "Low, gray clouds that often cover the entire sky like a blanket",
    "Contrail": "Man-made clouds formed by aircraft exhaust in the atmosphere"
}

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
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Cloud Classification API is running",
        "timestamp": time.time()
    }

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
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail="File must be an image (jpeg, png, gif, etc.)"
            )
        
        # Read file content (in real implementation, this would go to ML model)
        contents = await file.read()
        
        if len(contents) == 0:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty"
            )
        
        # Simulate processing time
        processing_start = time.time()
        await simulate_processing()
        processing_time = time.time() - processing_start
        
        # Generate mock prediction (replace with real ML model)
        predicted_cloud = random.choice(CLOUD_TYPES)
        confidence = round(random.uniform(0.75, 0.98), 3)
        
        # Create response
        response = {
            "success": True,
            "cloud_type": predicted_cloud,
            "confidence": confidence,
            "description": CLOUD_DESCRIPTIONS[predicted_cloud],
            "processing_time": round(processing_time, 3),
            "file_info": {
                "filename": file.filename,
                "content_type": file.content_type,
                "size_bytes": len(contents)
            },
            "metadata": {
                "model_version": "1.0.0",
                "timestamp": time.time()
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
    print("📡 Frontend CORS enabled for: http://localhost:3000")
    print("🔗 API will be available at: http://localhost:8000")
    print("💚 Health check: http://localhost:8000/health")
    print("📤 Upload endpoint: http://localhost:8000/predict-cloud")
    print()
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )