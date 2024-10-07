import { tileSize, zoom } from "../constants";
import { latLonToPixel } from "./latLonToPixel";
import { tileToPixel } from "./tileToPixel";

const metersPerPixel = (latitude, zoom) => {
  const earthCircumference = 40075016.686;
  const cosLat = Math.cos((latitude * Math.PI) / 180);
  const scale = 1 << zoom;
  return (earthCircumference * cosLat) / (tileSize * scale);
};

export function distanceToTileEdges(lat, lon, tileX, tileY) {
  const { pixelX, pixelY } = latLonToPixel(lat, lon, zoom);
  const { mapX: tileLeft, mapY: tileTop } = tileToPixel(tileX, tileY);
  const tileRight = tileLeft + tileSize;
  const tileBottom = tileTop + tileSize;
  const distanceTop = Math.abs(pixelY - tileTop);
  const distanceBottom = Math.abs(tileBottom - pixelY);
  const distanceLeft = Math.abs(pixelX - tileLeft);
  const distanceRight = Math.abs(tileRight - pixelX);
  const metersPerPixelValue = metersPerPixel(lat, zoom);
  return {
    top: distanceTop * metersPerPixelValue,
    bottom: distanceBottom * metersPerPixelValue,
    left: distanceLeft * metersPerPixelValue,
    right: distanceRight * metersPerPixelValue,
  };
}
