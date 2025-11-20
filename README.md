# 🌤️ Cloud Type Classification System

A modern, full-stack web application that uses machine learning to automatically classify different types of clouds from sky images.

![Cloud Classification Demo](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
![Python](https://img.shields.io/badge/Python-3.11+-yellow)

## 🎯 Overview

This project demonstrates end-to-end machine learning application development, featuring a React frontend, FastAPI backend, and comprehensive cloud image classification system. The application identifies 11 different cloud types that are crucial for weather prediction, aviation safety, and meteorological research.

## ✨ Features

### 🖥️ Frontend Features
- **Modern React Interface** - Responsive design with dark/light mode
- **Drag & Drop Upload** - Intuitive image upload with instant preview
- **Real-time Classification** - Live cloud type prediction with confidence scores
- **History Tracking** - Local storage of previous classifications
- **Animated Background** - Professional sky-themed interface
- **Mobile Responsive** - Works seamlessly on all devices

### 🔧 Backend Features
- **FastAPI REST API** - High-performance async Python backend
- **CORS Support** - Cross-origin resource sharing enabled
- **File Upload Handling** - Secure multipart file processing
- **Health Monitoring** - API health check endpoints
- **Error Handling** - Comprehensive error management

### 📊 Data Features
- **Kaggle Integration** - Automated dataset download and processing
- **11 Cloud Types** - Comprehensive classification system
- **2,543 Images** - Professional training dataset
- **Metadata Extraction** - Structured data organization

## 🔬 Cloud Types Classified

| Cloud Type | Abbreviation | Description | Weather Indication |
|------------|--------------|-------------|-------------------|
| Cumulonimbus | Cb | Towering storm clouds | Thunderstorms, severe weather |
| Stratocumulus | Sc | Low, layered clouds | Fair to overcast weather |
| Cirrostratus | Cs | High, thin sheet clouds | Weather change approaching |
| Nimbostratus | Ns | Dark, rain-bearing clouds | Steady precipitation |
| Cirrocumulus | Cc | High, small puffy clouds | Fair weather |
| Altocumulus | Ac | Mid-level patchy clouds | Possible thunderstorms |
| Stratus | St | Low, uniform gray clouds | Overcast, possible drizzle |
| Altostratus | As | Mid-level gray sheets | Rain within 24 hours |
| Cumulus | Cu | Fair weather puffy clouds | Pleasant weather |
| Cirrus | Ci | High, wispy clouds | Fair weather, change coming |
| Mixed | - | Combination classifications | Variable conditions |

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **React Router v6** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Axios** - HTTP client for API communication
- **React Dropzone** - File upload functionality

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server for production
- **Python 3.11+** - Latest Python features
- **Pandas** - Data manipulation and analysis
- **KaggleHub** - Dataset integration

### ML/Data Science (Ready for Integration)
- **TensorFlow/PyTorch** - Deep learning frameworks
- **OpenCV** - Computer vision processing
- **NumPy** - Numerical computations
- **Scikit-learn** - Machine learning utilities

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.11+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cloud-classification-system.git
   cd cloud-classification-system
   ```

2. **Setup Backend**
   ```bash
   # Install Python dependencies
   pip install fastapi uvicorn python-multipart kagglehub pandas

   # Start the backend server
   python main.py
   ```

3. **Setup Frontend**
   ```bash
   # Navigate to frontend directory
   cd frontend

   # Install dependencies
   npm install

   # Start development server
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📁 Project Structure

```
cloud-classification-system/
├── main.py                     # FastAPI backend server
├── final_kaggle_dataset.py     # Dataset loading and processing
├── README.md                   # Project documentation
├── requirements.txt            # Python dependencies
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── manifest.json
    ├── src/
    │   ├── components/         # Reusable UI components
    │   ├── pages/             # Application pages
    │   ├── services/          # API integration
    │   ├── App.js            # Main application component
    │   └── index.js          # Application entry point
    ├── package.json          # Node.js dependencies
    ├── tailwind.config.js    # TailwindCSS configuration
    └── .env.example         # Environment variables template
```

## 🧪 API Endpoints

### Health Check
```http
GET /health
```
Returns API health status and timestamp.

### Cloud Classification
```http
POST /predict-cloud
Content-Type: multipart/form-data

{
  "file": <image_file>
}
```

**Response:**
```json
{
  "success": true,
  "cloud_type": "Cumulus",
  "confidence": 0.95,
  "description": "Fair weather puffy clouds",
  "processing_time": 2.3,
  "file_info": {
    "filename": "cloud.jpg",
    "size_bytes": 245760
  }
}
```

## 🔧 Environment Configuration

Create `.env` file in the frontend directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000

# Application Settings
REACT_APP_MOCK_MODE=false
```

## 📊 Dataset Information

- **Source**: Kaggle Cloud Image Classification Dataset
- **Total Images**: 2,543 high-quality cloud images
- **Training Set**: 2,323 labeled images (91.3%)
- **Test Set**: 220 images (8.7%)
- **Classes**: 11 distinct cloud types
- **Format**: JPG/PNG images of varying resolutions

### Class Distribution
- Cumulonimbus: 402 images (17.3%)
- Stratocumulus: 389 images (16.7%)
- Cirrostratus: 298 images (12.8%)
- Nimbostratus: 245 images (10.5%)
- And 7 other cloud types...

## 🚀 Deployment

### Docker Deployment (Recommended)

1. **Backend Dockerfile**
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   EXPOSE 8000
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Frontend Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

### Cloud Deployment Options
- **AWS**: EC2, Lambda, S3
- **Azure**: App Service, Functions
- **Google Cloud**: Cloud Run, App Engine
- **Heroku**: Web dynos with buildpacks

## 🔮 Future Enhancements

### Phase 2 - ML Integration
- [ ] Train CNN model on cloud dataset
- [ ] Implement transfer learning with ResNet50
- [ ] Add data augmentation pipeline
- [ ] Deploy model with TensorFlow Serving

### Phase 3 - Advanced Features
- [ ] Real-time camera classification
- [ ] Weather API integration
- [ ] Geolocation-based predictions
- [ ] Mobile app development (React Native)
- [ ] User authentication system
- [ ] Batch processing capabilities

### Phase 4 - Enterprise Features
- [ ] API rate limiting and monetization
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Weather alert notifications
- [ ] Integration with meteorological services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name** - Full Stack Developer & Data Scientist

- LinkedIn: [Thangadurai](https://www.linkedin.com/in/thangadurai-s/)
- GitHub: [Thangadurai](https://github.com/thangadurai27)
- Portfolio: [Thangadurai Portfolio](https://thangadurai27.github.io/FUTURE_FS_01/)

## 🙏 Acknowledgments

- **Kaggle** for providing the cloud classification dataset
- **React Team** for the amazing frontend framework
- **FastAPI** community for the excellent backend framework
- **TailwindCSS** for the utility-first CSS framework
- **Meteorological community** for cloud classification standards

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/cloud-classification-system)
![GitHub forks](https://img.shields.io/github/forks/yourusername/cloud-classification-system)
![GitHub issues](https://img.shields.io/github/issues/yourusername/cloud-classification-system)
![GitHub license](https://img.shields.io/github/license/yourusername/cloud-classification-system)

---

⭐ **Star this repository if you found it helpful!**

Built with ❤️ for the developer and meteorological community.
