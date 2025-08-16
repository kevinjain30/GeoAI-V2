import React from 'react';
import { Download, X, Calendar, MapPin, Layers, AlertCircle, CheckCircle } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ResultsPanelProps {
  result: AnalysisResult | null;
  error: string | null;
  onDownload: () => void;
  onClear: () => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ result, error, onDownload, onClear }) => {
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-900">Analysis Error</h3>
          </div>
          <button
            onClick={onClear}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-base">{error}</p>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>Common issues:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Server connection problems</li>
            <li>Insufficient satellite data for the selected area</li>
            <li>Location outside supported regions</li>
          </ul>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">Analysis Complete</h3>
          </div>
          <button
            onClick={onClear}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analysis Metadata */}
        <div className="space-y-3 mb-4 text-base text-gray-700">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span>
              {result.location.lat.toFixed(6)}, {result.location.lng.toFixed(6)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span>
              {new Date(result.timestamp).toLocaleDateString()} at{' '}
              {new Date(result.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-gray-500" />
            <span>Sentinel-2 Multi-temporal Analysis</span>
          </div>
        </div>

        <button
          onClick={onDownload}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-base"
        >
          <Download className="w-5 h-5" />
          <span>Download Change Map</span>
        </button>
      </div>

      {/* Change Detection Image */}
      <div className="p-4 bg-gray-100">
        <div className="relative">
          <img
            src={result.imageUrl}
            alt="Change Detection Analysis"
            className="w-full h-auto rounded-lg shadow-md border border-gray-200"
          />
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
            Change Detection Map
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 p-4 bg-white rounded-lg">
          <h4 className="text-base font-semibold text-gray-900 mb-3">Legend</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>Significant Change</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span>Moderate Change</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>No Change</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>Water Bodies</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;