import { latLonToPixel } from "../../calculations/latLonToPixel";
import { tileToPixel } from "../../calculations/tileToPixel";
import { scale, tileSize } from "../../constants";
import useChestsStore from "../../stores/chestsStore";
import useTileStore from "../../stores/tileStore";
import Chest3D from "./Chest3D";

export default function Chests3D() {
  const { chests } = useChestsStore();
  const { userTile } = useTileStore();
  return (
    <>
      {chests.map((chests) => {
        const { pixelX, pixelY } = latLonToPixel(chests.lat, chests.lon);
        const { mapX, mapY } = tileToPixel(userTile[0], userTile[1]);

        const offsetX = pixelX - mapX;
        const offsetY = pixelY - mapY;

        return (
          <Chest3D
            key={chests.id}
            position={[
              scale * (-tileSize / 2 + offsetX),
              scale * (tileSize / 2 - offsetY),
            ]}
          />
        );
      })}
    </>
  );
}
