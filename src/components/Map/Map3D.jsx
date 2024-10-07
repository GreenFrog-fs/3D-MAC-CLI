import React, { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { latLonToTile } from "../../calculations/latLonToTile";
import { latLonToPixel } from "../../calculations/latLonToPixel";
import { tileToPixel } from "../../calculations/tileToPixel";
import { getDistance } from "../../calculations/getDistance";
import useUserStore from "../../stores/userStore";
import useChestsStore from "../../stores/chestsStore";
import { lootDistance, scale, tileSize, zoom } from "../../constants";
import Tiles3D from "./Tiles3D";
import Chests3D from "./Chests3D";
import usePageStore from "../../stores/pageStore";
import calculateAngle from "../../calculations/calculateAngle";
import Arrow3D from "./Arrow3D";
import useTileStore from "../../stores/tileStore";
import { distanceToTileEdges } from "../../calculations/distanceToTileEdges";
import User3D from "./User3D";

export default function Map3D({ style }) {
  const [arrowAngle, setArrowAngle] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0); // Состояние для угла вращения камеры
  const { position, setPosition, setClosestChest, prevPos } = useUserStore();
  const { chests } = useChestsStore();
  const { activateClicker } = usePageStore();
  const { userTile, setUserTile, addTile, tiles } = useTileStore();
  const canvasRef = useRef(null); // Ссылка на Canvas

  useEffect(() => {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        const x = latLonToTile(latitude, longitude, zoom).x;
        const y = latLonToTile(latitude, longitude, zoom).y;
        setUserTile([x, y]);
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    const distances = distanceToTileEdges(
      position[0],
      position[1],
      userTile[0],
      userTile[1]
    );
    if (distances.right < 150) addTile(1, 0);
    if (distances.left < 150) addTile(-1, 0);
    if (distances.top < 150) addTile(0, -1);
    if (distances.bottom < 150) addTile(0, 1);
    if (distances.top < 150 && distances.right < 150) addTile(1, -1);
    if (distances.top < 150 && distances.left < 150) addTile(-1, -1);
    if (distances.bottom < 150 && distances.right < 150) addTile(1, 1);
    if (distances.bottom < 150 && distances.left < 150) addTile(-1, 1);
  }, [userTile]);

  useEffect(() => {
    let mindistance = Infinity;
    let closest = null;
    chests.forEach((chest) => {
      const distance = getDistance(position, chest.lat, chest.lon);
      if (distance < mindistance) {
        mindistance = distance;
        closest = chest;
        setArrowAngle(
          -calculateAngle(position[0], position[1], chest.lat, chest.lon)
        );
        setClosestChest(chest);
        if (mindistance < lootDistance) {
          return activateClicker();
        }
      }
    });
  }, [position, chests]);

  const { pixelX: prevPixelX, pixelY: prevPixelY } = latLonToPixel(
    prevPos[0],
    prevPos[1]
  );
  const { pixelX, pixelY } = latLonToPixel(position[0], position[1]);
  const { mapX, mapY } = tileToPixel(userTile[0], userTile[1], tileSize);

  const offsetX = pixelX - mapX;
  const offsetY = pixelY - mapY;
  const prevOffsetX = prevPixelX - mapX;
  const prevOffsetY = prevPixelY - mapY;

  const userPosition = [
    scale * (-tileSize / 2 + offsetX),
    scale * (tileSize / 2 - offsetY),
  ];
  const prevUserPosition = [
    scale * (-tileSize / 2 + prevOffsetX),
    scale * (tileSize / 2 - prevOffsetY),
  ];

  function CameraController() {
    const { camera } = useThree();

    useEffect(() => {
      // Рассчитываем положение камеры в зависимости от угла вращения
      const radius = 20; // Радиус вращения камеры (расстояние от пользователя)
      const cameraX = userPosition[0] + radius * Math.cos(rotationAngle);
      const cameraY = userPosition[1] + radius * Math.sin(rotationAngle);
      const cameraZ = 60; // Высота камеры остается неизменной

      camera.position.set(cameraX, cameraY, cameraZ);

      // Рассчитываем угол вращения камеры по оси Z
      const angleToUser = Math.atan2(
        userPosition[1] - camera.position.y,
        userPosition[0] - camera.position.x
      );

      camera.lookAt(userPosition[0], userPosition[1], 0);

      camera.rotation.z = angleToUser - Math.PI / 2;
    }, [camera, userPosition]);

    return null;
  }

  // Обработчики мыши для управления углом вращения камеры
  const handleMouseDown = (event) => {
    const startX = event.clientX; // Начальная позиция X
    const startAngle = rotationAngle; // Текущий угол вращения

    const handleMouseMove = (event) => {
      const deltaX = event.clientX - startX; // Разница по X
      const newAngle = startAngle + deltaX * 0.01; // Изменяем угол вращения
      setRotationAngle(newAngle); // Обновляем угол
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Обработчики для сенсорного экрана
  const handleTouchStart = (event) => {
    const startX = event.touches[0].clientX; // Начальная позиция X при касании
    const startAngle = rotationAngle; // Текущий угол вращения

    const handleTouchMove = (event) => {
      const deltaX = event.touches[0].clientX - startX; // Разница по X
      const newAngle = startAngle + deltaX * 0.01; // Изменяем угол вращения
      setRotationAngle(newAngle); // Обновляем угол
    };

    const handleTouchEnd = () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  // Применяем обработчики событий на Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("touchstart", handleTouchStart);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("touchstart", handleTouchStart);
      }
    };
  }, [canvasRef]);

  return (
    <div className="scene" style={style}>
      <Canvas ref={canvasRef}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, -10, 7]} intensity={3} castShadow />
        <directionalLight position={[0, 10, 7]} intensity={3} castShadow />
        <CameraController />
        <Tiles3D
          userTileX={userTile[0]}
          userTileY={userTile[1]}
          tiles={tiles}
        />
        <Chests3D />
        <User3D position={userPosition} prev={prevUserPosition} />
        {chests.length > 0 && (
          <Arrow3D
            position={userPosition}
            prev={prevUserPosition}
            angle={arrowAngle}
          />
        )}
      </Canvas>
    </div>
  );
}
