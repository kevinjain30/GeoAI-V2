export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AnalysisResult {
  imageUrl: string;
  location: Coordinates;
  timestamp: string;
  analysisId: string;
  address: string; // Add the address field
}

export interface MapProps {
  onLocationSelect: (coords: Coordinates) => void;
  selectedLocation: Coordinates | null;
}