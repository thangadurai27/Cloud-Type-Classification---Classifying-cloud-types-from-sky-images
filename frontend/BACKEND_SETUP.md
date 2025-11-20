# 🔧 Backend Connection Setup & Troubleshooting Guide

## ✅ Pre-Connection Checklist

### 1. Backend Server Status
- [ ] Backend server is running on `http://localhost:8000`
- [ ] Backend health endpoint responds: `GET http://localhost:8000/health`
- [ ] Backend prediction endpoint exists: `POST http://localhost:8000/predict-cloud`

### 2. Environment Configuration
- [ ] `.env` file exists in frontend root directory
- [ ] `VITE_API_URL=http://localhost:8000` is set in `.env`
- [ ] No trailing slash in API URL
- [ ] Environment variables match your backend port

### 3. CORS Configuration (Backend)
Your backend must allow requests from `http://localhost:3000`. Add this to your backend:

#### For FastAPI:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

#### For Flask:
```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])
```

#### For Django:
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = False
```

### 4. API Endpoint Requirements

Your backend should have these endpoints:

#### `/health` (GET)
```json
{
  "status": "healthy",
  "timestamp": "2025-11-20T10:30:00Z"
}
```

#### `/predict-cloud` (POST)
**Request:**
- Content-Type: `multipart/form-data`
- Field: `file` (image file)

**Response:**
```json
{
  "cloud_type": "Cumulus",
  "confidence": 0.95,
  "processing_time": 2.3
}
```

## 🚀 Frontend Configuration

### Environment Variables (.env)
```bash
# Primary API URL (Vite)
VITE_API_URL=http://localhost:8000

# Legacy support (Create React App)
REACT_APP_API_URL=http://localhost:8000

# Optional: Enable mock mode if backend unavailable
VITE_MOCK_MODE=false
```

### API Configuration (api.js)
```javascript
// Automatic environment detection
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     process.env.REACT_APP_API_URL || 
                     'http://localhost:8000';

// Direct axios call with full URL
const response = await axios.post(`${API_BASE_URL}/predict-cloud`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 30000,
  withCredentials: false,
});
```

## 🔍 Troubleshooting Common Issues

### Connection Refused (ERR_CONNECTION_REFUSED)
**Symptoms:** "Unable to connect to server"
**Solutions:**
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check if port 8000 is in use: `netstat -an | findstr :8000`
3. Try different port and update `.env`
4. Check firewall/antivirus blocking the connection

### CORS Errors
**Symptoms:** "Access to fetch blocked by CORS policy"
**Solutions:**
1. Add CORS middleware to backend (see examples above)
2. Ensure frontend origin is in allowed origins list
3. Check CORS preflight requests in browser Network tab

### 404 Not Found
**Symptoms:** "API endpoint not found"  
**Solutions:**
1. Verify endpoint paths match exactly
2. Check if backend routes are properly registered
3. Ensure no extra slashes in URLs

### 422 Unprocessable Entity
**Symptoms:** "Invalid file format or size"
**Solutions:**
1. Check file size limits on backend
2. Verify accepted file types (JPG, PNG, GIF)
3. Ensure `file` field name matches backend expectation

### Timeout Errors
**Symptoms:** "Request timeout"
**Solutions:**
1. Increase timeout in axios config
2. Check backend processing time
3. Optimize model inference speed

## 🧪 Testing Backend Connection

### Manual Tests

1. **Health Check:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Image Upload Test:**
   ```bash
   curl -X POST -F "file=@test-image.jpg" http://localhost:8000/predict-cloud
   ```

3. **Browser Network Tab:**
   - Open DevTools → Network
   - Try uploading image
   - Check request/response details

### Frontend Connection Test
Use the "Test Backend Connection" button in the Upload page to verify connectivity.

## 📋 Quick Setup Commands

### 1. Start Backend (Example for FastAPI)
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Start Frontend
```bash
cd frontend
npm start
```

### 3. Verify Connection
```bash
curl http://localhost:8000/health
curl http://localhost:3000
```

## 🔧 Production Deployment

### Environment Variables for Production
```bash
# Production API URL
VITE_API_URL=https://your-api-domain.com

# Build command
npm run build
```

### CORS for Production
Update backend CORS to include your production domain:
```python
allow_origins=[
    "http://localhost:3000",  # Development
    "https://your-app-domain.com"  # Production
]
```

## 📞 Still Having Issues?

1. **Check Console Logs:** Open browser DevTools → Console
2. **Network Tab:** Check actual HTTP requests/responses
3. **Backend Logs:** Monitor backend server logs
4. **Environment:** Verify all environment variables are loaded
5. **Ports:** Ensure no conflicts with other services

**Common URLs to verify:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Health Check: http://localhost:8000/health
- Upload Endpoint: http://localhost:8000/predict-cloud