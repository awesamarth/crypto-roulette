"use client";

import { usePlane, useBox } from "@react-three/cannon";
//@ts-ignore
import { floorTexture, wallTexture } from "@/textures/textures.js";

export const Environment = () => {
  // Floor plane
  const [floorRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  // Walls
  const [wallRef1] = useBox(() => ({
    position: [0, 2.5, -50],
    rotation: [0, 0, 0],
    args: [100, 5, 1],
  }));

  const [wallRef2] = useBox(() => ({
    position: [0, 2.5, 50],
    rotation: [0, Math.PI, 0],
    args: [100, 5, 1],
  }));

  const [wallRef3] = useBox(() => ({
    position: [-25, 2.5, 0],
    rotation: [0, Math.PI / 2, 0],
    args: [100, 5, 1],
  }));

  const [wallRef4] = useBox(() => ({
    position: [25, 2.5, 0],
    rotation: [0, -Math.PI / 2, 0],
    args: [100, 5, 1],
  }));

  return (
    <>
      <mesh
        ref={floorRef}
        onClick={(e) => {
          e.stopPropagation();
          //@ts-ignore
          const [x, y, z] = Object.values(e.point).map((val) => Math.ceil(val));
          // console.log(x, y, z);
        }}
      >
        <planeGeometry attach="geometry" args={[100, 100]} />
        {/* @ts-ignore */}
        <meshStandardMaterial attach="material" map={floorTexture} />
      </mesh>

      {/* Walls */}
      <mesh ref={wallRef1}>
        <boxGeometry args={[100, 25, 1]} />
        {/* @ts-ignore */}
        <meshStandardMaterial map={wallTexture} emissive="#000000" color="#888888" />
      </mesh>
      <mesh ref={wallRef2}>
        <boxGeometry args={[100, 25, 1]} />
        {/* @ts-ignore */}
        <meshStandardMaterial map={wallTexture} emissive="#000000" color="#888888" />
      </mesh>
      <mesh ref={wallRef3}>
        <boxGeometry args={[100, 25, 1]} />
        {/* @ts-ignore */}
        <meshStandardMaterial map={wallTexture} emissive="#000000" color="#888888" />
      </mesh>
      <mesh ref={wallRef4}>
        <boxGeometry args={[100, 25, 1]} />
        {/* @ts-ignore */}
        <meshStandardMaterial map={wallTexture} emissive="#000000" color="#888888" />
      </mesh>
    </>
  );
};