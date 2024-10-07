import { Canvas } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

const AvatarModel = ({ src }) => {
  const modelRef = useRef(null);
  const gltf = useLoader(GLTFLoader, src);

  return (
    <primitive
      ref={modelRef}
      object={clone(gltf.scene)}
      scale={[8, 8, 8]}
      rotation={[0, -Math.PI / 2, 0]}
      position={[0, -10, 0]}
    />
  );
};

const Avatar = ({ style, src }) => {
  return (
    <div style={style} className="product_card_scene">
      <Canvas
        camera={{
          position: [0, 0, 25],
          fov: 90,
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 7.5]} intensity={2} castShadow />
        <Suspense>
          <AvatarModel src={src} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Avatar;
