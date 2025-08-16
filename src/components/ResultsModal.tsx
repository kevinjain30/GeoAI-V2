import React from 'react';
import { Download, X, Calendar, MapPin, Layers, CheckCircle } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ResultsModalProps {
  result: AnalysisResult;
  onClose: () => void;
  onDownload: () => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({ result, onClose, onDownload }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-4">
            <CheckCircle className="w-7 h-7 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Analysis Complete</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-grow overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image */}
          <div className="lg:col-span-2 relative">
            <img
              src={result.imageUrl}
              alt="Change Detection Analysis"
              className="w-full h-auto rounded-xl shadow-lg border border-gray-200"
            />
             <div className="absolute bottom-3 right-3 bg-black/70 text-white text-sm px-3 py-1 rounded-md">
                Change Detection Map
            </div>
          </div>

          {/* Details & Legend */}
          <div className="space-y-6">
            {/* Metadata */}
            <div className="space-y-4 text-base text-gray-700">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-gray-800">Location</p>
                    <p>{result.location.lat.toFixed(6)}, {result.location.lng.toFixed(6)}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-gray-800">Timestamp</p>
                    <p>{new Date(result.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Layers className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-gray-800">Data Source</p>
                    <p>Sentinel-2 Analysis</p>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-base font-semibold text-gray-900 mb-3">Legend</h4>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span>Significant Change</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span>Moderate Change</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>No Change</span>
                </div>
                 <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>Water Bodies</span>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={onDownload}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-base"
            >
              <Download className="w-5 h-5" />
              <span>Download Full Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;