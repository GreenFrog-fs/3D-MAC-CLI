import { tileSize } from "../constants";

export function tileToPixel(x, y) {
  const mapX = x * tileSize;
  const mapY = y * tileSize;
  return { mapX, mapY };
}
