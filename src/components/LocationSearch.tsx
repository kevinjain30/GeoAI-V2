import React, { useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Coordinates } from '../types';

interface LocationSearchProps {
  onLocationSelect: (coords: Coordinates, address: string) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || autocompleteRef.current) return;

    const autocompleteElement = new (window as any).google.maps.places.PlaceAutocompleteElement();
    
    // Style the input element inside the web component
    const input = autocompleteElement.querySelector('input');
    if(input) {
      input.classList.add(
        'w-full', 'pl-10', 'pr-4', 'py-2', 'border', 'border-gray-300',
        'rounded-lg', 'focus:ring-2', 'focus:ring-blue-500', 
        'focus:border-transparent', 'transition-colors'
      );
      input.placeholder = 'Search for a location...';
    }
    
    containerRef.current.appendChild(autocompleteElement);
    autocompleteRef.current = autocompleteElement;

    const placeChangeHandler = () => {
      const place = autocompleteRef.current?.place;

      if (place?.location) {
        const coords = {
          lat: place.location.latitude,
          lng: place.location.longitude,
        };
        onLocationSelect(coords, place.displayName || place.formattedAddress);
      }
    };

    autocompleteElement.addEventListener('gmp-placechange', placeChangeHandler);

    return () => {
      autocompleteElement.removeEventListener('gmp-placechange', placeChangeHandler);
    };
  }, [onLocationSelect]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
      <div ref={containerRef} />
    </div>
  );
};

export default LocationSearch;