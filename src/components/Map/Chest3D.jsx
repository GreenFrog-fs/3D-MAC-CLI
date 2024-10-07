import { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

import { useLoader } from "@react-three/fiber";

export default function Chest3D({ position }) {
  const modelRef = useRef(null);
  const gltf = useLoader(GLTFLoader, "/models/chest3D.glb");

  return (
    <primitive
      ref={modelRef}
      object={clone(gltf.scene)}
      position={[...position, 20]}
      scale={[8, 8, 8]}
      rotation={[Math.PI / 2, -Math.PI / 2, 0]}
    />
  );
}
