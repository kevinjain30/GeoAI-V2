import React from 'react';
import { X, Satellite, Calendar, MapPin, Layers, Zap } from 'lucide-react';

interface InfoPanelProps {
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Satellite className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">SatelliteVision</h2>
                <p className="text-gray-600">Advanced Change Detection Platform</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Application</h3>
            <p className="text-gray-600 leading-relaxed">
              SatelliteVision is a powerful change detection platform that analyzes satellite imagery 
              to identify environmental and land-use changes over time. Using advanced algorithms and 
              high-resolution Sentinel-2 satellite data, it provides detailed insights into how our 
              planet is changing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Temporal Analysis</h4>
              </div>
              <p className="text-sm text-blue-700">
                Compares satellite imagery from 2021 and 2024 to detect changes over a 3-year period.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Layers className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-900">High Resolution</h4>
              </div>
              <p className="text-sm text-green-700">
                Uses Sentinel-2 satellite data with 10-15 meter resolution for detailed analysis.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                <h4 className="font-medium text-purple-900">Global Coverage</h4>
              </div>
              <p className="text-sm text-purple-700">
                Analyze any location worldwide with available satellite coverage.
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-orange-600" />
                <h4 className="font-medium text-orange-900">Fast Processing</h4>
              </div>
              <p className="text-sm text-orange-700">
                Cloud-optimized processing delivers results in under 60 seconds.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">How to Use</h4>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">1</span>
                <span>Click anywhere on the satellite map to select your area of interest</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">2</span>
                <span>Click "Start Analysis" to begin the change detection process</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">3</span>
                <span>Review the generated change map and download the results</span>
              </li>
            </ol>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Technical Details</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Powered by Google Earth Engine</li>
              <li>• Uses Sentinel-2 Level-2A surface reflectance data</li>
              <li>• Applies cloud masking and atmospheric correction</li>
              <li>• Generates composite images for optimal quality</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;