import { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

import { useLoader } from "@react-three/fiber";

export default function Arrow3D({ position, prev, angle }) {
  const modelRef = useRef(null);
  const gltf = useLoader(GLTFLoader, "/models/angle.glb");

  const [currentPosition, setCurrentPosition] = useState(prev);

  useEffect(() => {
    if (isNaN(prev[0]) || isNaN(prev[1])) {
      setCurrentPosition(position);
    } else {
      let frame = 0;
      const transitionFrames = 60;
      const startPosition = [...prev];
      const animate = () => {
        frame++;
        const lerpPosition = [
          startPosition[0] +
            ((position[0] - startPosition[0]) * frame) / transitionFrames,
          startPosition[1] +
            ((position[1] - startPosition[1]) * frame) / transitionFrames,
        ];
        setCurrentPosition(lerpPosition);

        if (frame < transitionFrames) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }, [position, prev]);

  return (
    <primitive
      ref={modelRef}
      object={clone(gltf.scene)}
      position={[...currentPosition, 5]}
      scale={[3, 3, 3]}
      rotation={[Math.PI / 2, angle, 0]}
    />
  );
}
