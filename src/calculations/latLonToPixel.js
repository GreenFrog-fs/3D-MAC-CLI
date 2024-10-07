import { tileSize, zoom } from "../constants";

export function latLonToPixel(lat, lon) {
  const n = Math.pow(2, zoom);
  const lon_rad = lon * (Math.PI / 180);
  const lat_rad = lat * (Math.PI / 180);
  const x = ((lon_rad + Math.PI) / (2 * Math.PI)) * n;
  const y =
    ((1 - Math.log(Math.tan(lat_rad) + 1 / Math.cos(lat_rad)) / Math.PI) / 2) *
    n;
  const pixelX = x * tileSize;
  const pixelY = y * tileSize;
  return { pixelX, pixelY };
}
