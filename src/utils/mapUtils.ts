import { Coordinates } from '../types';

export const formatCoordinates = (coords: Coordinates): string => {
  const latDir = coords.lat >= 0 ? 'N' : 'S';
  const lngDir = coords.lng >= 0 ? 'E' : 'W';
  
  return `${Math.abs(coords.lat).toFixed(6)}°${latDir}, ${Math.abs(coords.lng).toFixed(6)}°${lngDir}`;
};

export const isValidCoordinates = (coords: Coordinates): boolean => {
  return (
    coords.lat >= -90 && 
    coords.lat <= 90 && 
    coords.lng >= -180 && 
    coords.lng <= 180
  );
};

export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getLocationName = async (coords: Coordinates): Promise<string> => {
  try {
    // This would typically use a geocoding service
    // For now, return formatted coordinates
    return formatCoordinates(coords);
  } catch (error) {
    return formatCoordinates(coords);
  }
};