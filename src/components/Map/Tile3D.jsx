import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import Buildings3D from "./Buildings3D";

const Tile3D = React.memo(({ x, y, position, zoom, size, scale }) => {
  const meshRef = useRef(null);
  const tileUrl = `/minitiles/${zoom}/${x}/${y}.jpg`;
  const texture = useLoader(TextureLoader, tileUrl);
  console.log("rere");
  return (
    <group>
      <mesh ref={meshRef} position={position} scale={scale}>
        <planeGeometry args={[size[0], size[1]]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Рендер здания через новый компонент */}
      <Buildings3D
        x={x}
        y={y}
        zoom={zoom}
        position={position}
        scale={scale}
        tileSize={size[0]}
        userPosition={[0, 0]}
      />
    </group>
  );
});

export default Tile3D;
