import React, { useRef, useEffect, memo, useMemo } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader, useFrame } from "@react-three/fiber";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import * as THREE from "three";

const UserModel3D = ({ avatar_src, walk }) => {
  const modelRef = useRef(null);
  const mixerRef = useRef(null);
  const memoizedAvatarSrc = useMemo(() => avatar_src, [avatar_src]);
  const gltf = useLoader(GLTFLoader, memoizedAvatarSrc);
  const clonedScene = useMemo(() => clone(gltf.scene), [gltf.scene]);

  useEffect(() => {
    if (gltf.animations && gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(clonedScene);
      mixerRef.current = mixer;
      const index = walk ? 1 : 0;
      const animation = gltf.animations[index];
      const action = mixer.clipAction(animation);
      action.reset().play();
    } else {
      console.log("No animations available for this model.");
    }

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, [gltf.animations, clonedScene, walk]);

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  useMemo(() => {
    clonedScene.traverse((object) => {
      if (object.isMesh) {
        object.material.side = THREE.DoubleSide;
        object.material.depthWrite = true;
        object.material.transparent = false;
        if (object.material.transparent) {
          object.material.depthWrite = false;
          object.material.depthTest = true;
        }
      }
    });
  }, [clonedScene]);

  return (
    <primitive
      ref={modelRef}
      object={clonedScene}
      scale={[9, 9, 9]}
      rotation={[Math.PI / 2, Math.PI, 0]}
    />
  );
};

export default memo(UserModel3D);
