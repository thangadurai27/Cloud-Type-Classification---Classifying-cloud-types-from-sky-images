# Cloud Type Classification Frontend

A modern, responsive React application for classifying cloud types using AI. This frontend provides an intuitive interface for uploading sky images and receiving detailed cloud type predictions.

## Features

- **Modern UI**: Built with React, TailwindCSS, and Framer Motion
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes
- **Drag & Drop Upload**: Easy image upload with validation
- **Real-time Results**: Instant cloud classification with confidence scores
- **History Tracking**: View previous classifications stored locally
- **Detailed Information**: Learn about different cloud types and their significance

## Supported Cloud Types

The application can identify 11 different cloud types:

- **Cumulus** - Puffy, cotton-like clouds
- **Cumulonimbus** - Towering storm clouds
- **Stratus** - Low, flat layer clouds
- **Cirrus** - High, wispy clouds
- **Altocumulus** - Mid-level patches or layers
- **Altostratus** - Mid-level gray cloud sheets
- **Stratocumulus** - Low, lumpy cloud patches
- **Nimbostratus** - Dark rain clouds
- **Cirrostratus** - Thin, high cloud sheets
- **Cirrocumulus** - Small, high cloud patches

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cloud-classification-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## API Integration

The frontend is designed to work with a FastAPI backend. Update the `REACT_APP_API_URL` environment variable to point to your backend server.

### Expected API Endpoints

- `POST /predict-cloud` - Cloud type prediction
  - Accepts: `multipart/form-data` with image file
  - Returns: `{ cloud_type, confidence, processing_time }`

- `GET /health` - Health check
- `GET /model-info` - Model information

### Mock Mode

For development without a backend, the application includes mock API responses. The mock function simulates realistic prediction results with random cloud types and confidence scores.

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Technology Stack

- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Dropzone** - File upload component
- **Lucide React** - Icon library
- **Axios** - HTTP client

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js
│   ├── Footer.js
│   ├── CloudBackground.js
│   └── LoadingSpinner.js
├── pages/              # Page components
│   ├── Home.js
│   ├── Upload.js
│   ├── Results.js
│   ├── History.js
│   └── About.js
├── services/           # API and external services
│   └── api.js
├── App.js             # Main application component
├── App.css            # Global styles
└── index.js           # Application entry point
```

## Features in Detail

### Image Upload
- Drag & drop or click to upload
- File type validation (JPG, PNG, GIF)
- File size validation (max 10MB)
- Instant image preview
- Error handling and user feedback

### Results Display
- Large, clear cloud type identification
- Confidence score with color coding
- Detailed cloud descriptions
- Weather significance information
- Image display with metadata

### History Management
- Local storage of classification history
- Filterable by cloud type
- Detailed view modals
- Statistics and analytics
- Clear history functionality

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## Customization

### Styling
The application uses TailwindCSS with custom color schemes:
- Sky colors for primary elements
- Cloud colors for neutral elements
- Gradient backgrounds for visual appeal

### Animations
Framer Motion provides smooth transitions:
- Page transitions
- Component animations
- Hover effects
- Loading states

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Dataset provided by Nakendra Prasath K on Kaggle
- Icons by Lucide React
- Animations by Framer Motion
- Styling by TailwindCSS