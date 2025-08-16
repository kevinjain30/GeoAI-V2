import React from 'react';
import { Satellite, Loader2 } from 'lucide-react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4">
        <div className="text-center">
          <div className="relative mb-6">
            <Satellite className="w-16 h-16 text-blue-600 mx-auto animate-pulse" />
            <Loader2 className="w-6 h-6 text-blue-400 absolute top-0 right-0 animate-spin" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Processing Satellite Data
          </h3>
          
          <p className="text-gray-600 mb-6">
            Analyzing multi-temporal satellite imagery to detect changes...
          </p>
          
          <div className="space-y-3 text-sm text-gray-500">
            <div className="flex items-center justify-between">
              <span>Fetching 2021 imagery</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between">
              <span>Fetching 2024 imagery</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between">
              <span>Running change detection</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between">
              <span>Generating results</span>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          
          <div className="mt-6 text-xs text-gray-400">
            This process typically takes 30-60 seconds
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;