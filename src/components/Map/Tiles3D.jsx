import React, { useMemo } from "react";
import { planeHeight, planeWidth, scale, zoom } from "../../constants";
import Tile3D from "./Tile3D";

// Оборачиваем компонент в React.memo для мемоизации
const Tiles3D = React.memo(({ tiles, userTileX, userTileY }) => {
  // Используем useMemo для мемоизации массива Tile3D
  const userTile = [userTileX, userTileY];
  const memoizedTiles = useMemo(() => {
    return tiles.map((position, index) => (
      <Tile3D
        key={index}
        x={position[0]}
        y={position[1]}
        position={[
          planeWidth * scale * (position[0] - userTile[0]),
          planeHeight * scale * (userTile[1] - position[1]),
          0,
        ]}
        zoom={zoom}
        size={[planeWidth, planeHeight]}
        scale={scale}
      />
    ));
  }, [tiles, userTile]); // Обновляем только при изменении tiles или userTile

  return <>{memoizedTiles}</>;
});

// Экспортируем мемоизированный компонент
export default Tiles3D;
