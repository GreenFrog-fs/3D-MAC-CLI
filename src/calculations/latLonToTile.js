export function latLonToTile(lat, lon, zoom) {
  const n = Math.pow(2, zoom);
  const lon_rad = lon * (Math.PI / 180);
  const lat_rad = lat * (Math.PI / 180);
  const x = ((lon_rad + Math.PI) / (2 * Math.PI)) * n;
  const y =
    ((1 - Math.log(Math.tan(lat_rad) + 1 / Math.cos(lat_rad)) / Math.PI) / 2) *
    n;
  return { x: Math.floor(x), y: Math.floor(y) };
}
