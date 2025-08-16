import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { MapPin, Satellite } from 'lucide-react';
import { MapProps } from '../types';

const MapInterface = forwardRef<any, MapProps>(({ onLocationSelect, selectedLocation }, ref) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useImperativeHandle(ref, () => ({
    getMap: () => mapInstanceRef.current,
  }));

  useEffect(() => {
    if (!mapContainerRef.current || !(window as any).google?.maps) {
      return;
    }

    setIsMapReady(true);

    // Initialize map with a global view
    const map = new (window as any).google.maps.Map(mapContainerRef.current, {
      zoom: 2,
      center: { lat: 20, lng: 0 },
      mapTypeId: 'satellite',
      styles: [
        {
          featureType: 'all',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ],
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: (window as any).google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: (window as any).google.maps.ControlPosition.TOP_RIGHT,
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
      },
      zoomControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    mapInstanceRef.current = map;

    // Add click listener
    map.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      onLocationSelect({ lat, lng });
    });

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [onLocationSelect]);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Create new marker
    const marker = new (window as any).google.maps.Marker({
      position: selectedLocation,
      map: mapInstanceRef.current,
      title: `Selected Location: ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`,
      icon: {
        path: (window as any).google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#3B82F6',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
      },
    });

    markerRef.current = marker;

    // Center map on selected location
    mapInstanceRef.current.setCenter(selectedLocation);
    if (mapInstanceRef.current.getZoom() < 10) {
      mapInstanceRef.current.setZoom(12);
    }
  }, [selectedLocation]);

  return (
    <div className="relative w-full h-full bg-gray-200">
      <div ref={mapContainerRef} className={`w-full h-full transition-opacity duration-300 ${isMapReady ? 'opacity-100' : 'opacity-0'}`} />

      {/* Fallback for when Google Maps isn't available */}
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map</h3>
            <p className="text-gray-600 mb-4">
              Loading map... If it doesn't appear, please check your API key and internet connection.
            </p>
          </div>
        </div>
      )}

      {/* Map Controls Overlay */}
      {isMapReady && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <Satellite className="w-4 h-4" />
            <span>Satellite View</span>
          </div>
        </div>
      )}
    </div>
  );
});

MapInterface.displayName = 'MapInterface';

export default MapInterface;