import { useJsApiLoader } from '@react-google-maps/api';
import { MAP_LIBRARIES } from '../utils/constants';

export function useGoogleMaps(apiKey) {
  // If the key is the default placeholder, pass an empty string so the SDK 
  // loads in warning/development mode rather than failing completely.
  const cleanApiKey = (apiKey === 'LyBIp7Yfo8xtLJRdQXNC') ? '' : apiKey;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: cleanApiKey,
    libraries: MAP_LIBRARIES,
    id: 'google-map-script'
  });

  return {
    isLoaded,
    loadError
  };
}
