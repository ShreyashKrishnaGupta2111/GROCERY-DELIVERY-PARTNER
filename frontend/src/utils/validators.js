export function validateSearchQuery(query) {
  if (!query) return false;
  return query.trim().length > 0;
}

export function validateCoordinates(lat, lng) {
  if (lat === undefined || lng === undefined) return false;
  const numLat = parseFloat(lat);
  const numLng = parseFloat(lng);
  return !isNaN(numLat) && numLat >= -90 && numLat <= 90 && !isNaN(numLng) && numLng >= -180 && numLng <= 180;
}
