# SatelliteVision - Change Detection Platform

A modern web application for satellite-based change detection analysis using Google Earth Engine and Sentinel-2 satellite imagery.

## Features

- **Interactive Map Interface**: Click anywhere on the globe to select analysis locations
- **Multi-temporal Analysis**: Compare satellite imagery from 2021 vs 2024
- **High-Resolution Data**: Uses Sentinel-2 satellite data with 10-15 meter resolution
- **Advanced Processing**: Cloud masking, atmospheric correction, and composite generation
- **Real-time Results**: Fast processing with detailed change detection maps
- **Export Capabilities**: Download high-quality analysis results
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Python Flask + Google Earth Engine
- **Satellite Data**: Sentinel-2 Level-2A Surface Reflectance
- **Image Processing**: OpenCV + NumPy + Matplotlib
- **Maps**: Google Maps JavaScript API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Google Earth Engine account (optional - mock data available)
- Google Maps API key (for enhanced map features)

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Set up Google Earth Engine (optional):
```bash
earthengine authenticate
```

### Development

Start both frontend and backend:
```bash
npm run dev:full
```

Or start them separately:
```bash
# Frontend (port 5173)
npm run dev

# Backend (port 5001)
npm run server
```

## Usage

1. **Select Location**: Click anywhere on the satellite map to choose your area of interest
2. **Start Analysis**: Click the "Start Analysis" button to begin processing
3. **View Results**: Review the generated change detection map with detailed statistics
4. **Download**: Save the analysis results as high-quality images

## API Endpoints

- `POST /api/detect-change`: Perform change detection analysis
- `GET /api/health`: Check server status and capabilities

## Change Detection Algorithm

The application uses advanced computer vision techniques:

1. **Image Preprocessing**: Noise reduction and standardization
2. **Temporal Comparison**: Pixel-wise difference analysis
3. **Morphological Operations**: Noise filtering and feature enhancement
4. **Multi-threshold Classification**: Categorizes changes by intensity
5. **Statistical Analysis**: Provides quantitative change metrics

## Deployment

Build for production:
```bash
npm run build
```

The application can be deployed to any static hosting service for the frontend, with the Python backend deployed to cloud platforms like Heroku, AWS, or Google Cloud.

## License

MIT License - see LICENSE file for details.