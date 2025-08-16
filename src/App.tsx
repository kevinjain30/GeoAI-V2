import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Satellite, MapPin, Layers, Info, Calendar, Loader2, History } from 'lucide-react';
import MapInterface from './components/MapInterface';
import LoadingOverlay from './components/LoadingOverlay';
import InfoPanel from './components/InfoPanel';
import LocationSearch from './components/LocationSearch';
import ResultsModal from './components/ResultsModal';
import HistoryPanel from './components/HistoryPanel';
import { AnalysisResult, Coordinates } from './types';

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

  // This function now directly controls the map after a search or click.
  const handleLocationSelect = (coords: Coordinates, address?: string) => {
    setSelectedLocation(coords);
    setSelectedAddress(address || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
    setError(null);

    // Directly command the map to move.
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      if (map) {
        map.panTo(coords); // Use panTo for a smooth transition
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
      const response = await fetch('/api/detect-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: selectedLocation.lat, lng: selectedLocation.lng }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const newResult: AnalysisResult = {
        imageUrl: URL.createObjectURL(blob),
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
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Analysis failed:', err);
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
                      <span>Start Analysis</span>
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