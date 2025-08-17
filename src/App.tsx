import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Satellite, MapPin, Layers, Info, Calendar, Loader2, History } from 'lucide-react';
import MapInterface from './components/MapInterface';
import LoadingOverlay from './components/LoadingOverlay';
import InfoPanel from './components/InfoPanel';
import LocationSearch from './components/LocationSearch';
import ResultsModal from './components/ResultsModal';
import HistoryPanel from './components/HistoryPanel';
import { AnalysisResult, Coordinates } from './types';

// Mock function to create a demo change detection image
const createMockAnalysisImage = (location: Coordinates): Promise<string> => {
  return new Promise((resolve) => {
    // Create a canvas to generate a mock satellite change detection image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 800;
    canvas.height = 600;
    
    // Background
    ctx.fillStyle = '#2d5016'; // Dark green background
    ctx.fillRect(0, 0, 800, 600);
    
    // Add some "satellite imagery" patterns
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgb(${45 + Math.random() * 40}, ${80 + Math.random() * 40}, ${16 + Math.random() * 20})`;
      ctx.fillRect(Math.random() * 800, Math.random() * 600, Math.random() * 20, Math.random() * 20);
    }
    
    // Add change detection areas
    // Red areas (significant change)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(400, 200, 50, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(600, 400, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Yellow areas (moderate change)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(200, 300, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(650, 150, 35, 0, Math.PI * 2);
    ctx.fill();
    
    // Blue areas (water)
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(50, 450, 200, 100);
    
    // Add text overlay
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('SatelliteVision - Change Detection Analysis', 50, 50);
    
    ctx.font = '16px Arial';
    ctx.fillText(`Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`, 50, 580);
    ctx.fillText('Time Period: 2021-2024 | Data: Sentinel-2', 400, 580);
    
    // Convert canvas to blob URL
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(URL.createObjectURL(blob));
      }
    }, 'image/jpeg', 0.8);
  });
};

function App() {
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewingResult, setViewingResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const mapRef = useRef<any>(null);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('analysisHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  const handleLocationSelect = (coords: Coordinates, address?: string) => {
    setSelectedLocation(coords);
    setSelectedAddress(address || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
    setError(null);

    if (mapRef.current) {
      const map = mapRef.current.getMap();
      if (map) {
        map.panTo(coords);
        if (map.getZoom() < 10) {
          map.setZoom(12);
        }
      }
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!selectedLocation || !selectedAddress) {
      setError('Please select a location on the map first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate processing time (2-4 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      // Create mock analysis image
      const imageUrl = await createMockAnalysisImage(selectedLocation);
      
      const newResult: AnalysisResult = {
        imageUrl,
        location: selectedLocation,
        timestamp: new Date().toISOString(),
        analysisId: `analysis_${Date.now()}`,
        address: selectedAddress,
      };
      
      const newHistory = [newResult, ...history];
      setHistory(newHistory);
      localStorage.setItem('analysisHistory', JSON.stringify(newHistory));
      
      setViewingResult(newResult);

    } catch (err) {
      const errorMessage = 'Demo analysis completed successfully!';
      setError(null); // Don't show error for demo
      console.log('Demo analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedLocation, selectedAddress, history]);

  const handleDownload = useCallback(() => {
    if (!viewingResult) return;
    const link = document.createElement('a');
    link.href = viewingResult.imageUrl;
    link.download = `change-detection-${viewingResult.analysisId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [viewingResult]);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to delete all analysis history? This cannot be undone.")) {
        setHistory([]);
        localStorage.removeItem('analysisHistory');
    }
  };

  const handleViewHistoryItem = (result: AnalysisResult) => {
    setViewingResult(result);
    setIsHistoryOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Satellite className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SatelliteVision</h1>
                <p className="text-sm text-gray-600">Change Detection Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
                {/* Demo Badge */}
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  DEMO MODE
                </span>
                <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View analysis history"
                >
                    <History className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setShowInfo(true)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="About this application"
                >
                    <Info className="w-5 h-5" />
                </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Notice */}
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Info className="w-5 h-5 text-yellow-600 mr-2" />
            <p className="text-yellow-800">
              <strong>Demo Mode:</strong> This is a demonstration version that generates mock change detection results. 
              The full version connects to real satellite data processing services.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Location Selection</h2>
                  </div>
                   {selectedAddress && (
                    <div className="text-sm text-gray-600 truncate" title={selectedAddress}>
                      {selectedAddress}
                    </div>
                  )}
                </div>
                <LocationSearch onLocationSelect={handleLocationSelect} />
              </div>
              <div className="h-96 lg:h-[500px]">
                <MapInterface
                  ref={mapRef}
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={selectedLocation}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Control Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center space-x-3 mb-4">
                <Layers className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Analysis Controls</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Time Period</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Comparing 2021 vs 2024 satellite imagery
                  </p>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!selectedLocation || isAnalyzing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Satellite className="w-4 h-4" />
                      <span>Start Demo Analysis</span>
                    </>
                  )}
                </button>

                {!selectedLocation && (
                    <p className="text-xs text-center text-gray-500">
                        Please select a location on the map or use the search bar to begin.
                    </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Error Display */}
      {error && (
        <div className="fixed top-20 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
          <div className="flex justify-between items-start">
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Overlays */}
      {isAnalyzing && <LoadingOverlay />}
      {showInfo && <InfoPanel onClose={() => setShowInfo(false)} />}
      {isHistoryOpen && (
        <HistoryPanel 
            history={history}
            onView={handleViewHistoryItem}
            onClear={handleClearHistory}
            onClose={() => setIsHistoryOpen(false)}
        />
      )}
      {viewingResult && (
        <ResultsModal 
          result={viewingResult} 
          onClose={() => setViewingResult(null)} 
          onDownload={handleDownload} 
        />
      )}
    </div>
  );
}

export default App;