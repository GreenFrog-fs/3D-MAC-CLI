import React, { useEffect, useMemo, useCallback } from "react";
import { ExtrudeGeometry, Shape } from "three";

const Buildings3D = ({
  x,
  y,
  zoom,
  position,
  scale,
  tileSize,
  userPosition,
}) => {
  const [buildings, setBuildings] = React.useState([]);

  useEffect(() => {
    const buildingsUrl = `/buildings/${zoom}/${x}/${y}.json`;
    fetch(buildingsUrl)
      .then((res) => res.json())
      .then((data) => setBuildings(data))
      .catch((error) => console.error("Error fetching buildings:", error));
  }, [zoom, x, y]);

  const scaleFactor = tileSize / 1024; // Исходя из вашего изображения

  const createPolygonShape = useCallback(
    (coordinates) => {
      const shape = new Shape();
      coordinates.forEach((coord, index) => {
        const [x, y] = coord.map((c) => c * scaleFactor); // Применение scaleFactor
        if (index === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      });
      shape.closePath();
      return shape;
    },
    [scaleFactor]
  );

  const calculateBuildingHeight = useCallback((coordinates) => {
    const area =
      coordinates.reduce((acc, [x, y], i, arr) => {
        const [xNext, yNext] = arr[(i + 1) % arr.length];
        return acc + x * yNext - xNext * y;
      }, 0) / 2;

    return area < 25 ? 0 : area < 2500 ? 2 : 12;
  }, []);

  const calculateDistanceToUser = useCallback(
    (coordinates) => {
      let minDistance = Infinity;
      coordinates.forEach(([x, y]) => {
        const dist = Math.sqrt(
          (x * scaleFactor + position[0] - userPosition[0]) ** 2 +
            (y * scaleFactor + position[1] - userPosition[1]) ** 2
        );
        if (dist < minDistance) minDistance = dist;
      });
      return minDistance;
    },
    [userPosition, position, scaleFactor]
  );

  const buildingMeshes = useMemo(() => {
    return buildings.map((building, index) => {
      const shape = createPolygonShape(building.coordinates);
      const height = calculateBuildingHeight(building.coordinates);
      const distance = calculateDistanceToUser(building.coordinates);
      const opacity = distance < 15 ? 0.5 : 1;

      const geometry = new ExtrudeGeometry(shape, {
        depth: height,
        bevelEnabled: false,
      });

      // Применение позиции к каждому зданию
      const buildingPosition = [
        position[0] - (tileSize / 2) * scale, // Смещение по X
        position[1] - (tileSize / 2) * scale, // Смещение по Y
        0, // Высота по Z
      ];

      return (
        <group key={index}>
          <mesh position={buildingPosition} scale={scale} geometry={geometry}>
            <meshBasicMaterial color="#c48a17" transparent opacity={opacity} />
          </mesh>
          <lineSegments position={buildingPosition} scale={scale}>
            <edgesGeometry attach="geometry" args={[geometry]} />
            <lineBasicMaterial color="black" />
          </lineSegments>
        </group>
      );
    });
  }, [
    buildings,
    createPolygonShape,
    calculateBuildingHeight,
    calculateDistanceToUser,
    position,
    scale,
  ]);

  return <>{buildingMeshes}</>;
};

export default Buildings3D;
