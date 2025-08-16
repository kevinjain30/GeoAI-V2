import React from 'react';
import { History, X, Trash2, MapPin } from 'lucide-react';
import { AnalysisResult } from '../types';

interface HistoryPanelProps {
  history: AnalysisResult[];
  onView: (result: AnalysisResult) => void;
  onClear: () => void;
  onClose: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onView, onClear, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <History className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Analysis History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-grow overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              <p>Your past analyses will appear here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {history.map((item) => (
                <li key={item.analysisId} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.address}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1.5" />
                        {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => onView(item)}
                      className="ml-4 bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                    >
                      View
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={onClear}
              className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;