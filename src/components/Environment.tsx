//@ts-nocheck
"use client";

import { usePlane, useBox } from "@react-three/cannon";
//@ts-ignore
import {
  floorTexture,
  wallTexture,
  ceilingTexture,
} from "@/textures/textures.js";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export const Environment = () => {
  // Floor plane
  const [floorRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  // Walls
  const [wallRef1] = useBox(() => ({
    position: [0, 2.5, -20],
    rotation: [0, 0, 0],
    args: [100, 5, 1],
  }));

  const [wallRef2] = useBox(() => ({
    position: [0, 2.5, 20],
    rotation: [0, Math.PI, 0],
    args: [100, 5, 1],
  }));

  const [wallRef3] = useBox(() => ({
    position: [-20, 2.5, 0],
    rotation: [0, Math.PI / 2, 0],
    args: [100, 5, 1],
  }));

  const [wallRef4] = useBox(() => ({
    position: [20, 2.5, 0],
    rotation: [0, -Math.PI / 2, 0],
    args: [100, 5, 1],
  }));

  // Ceiling
  const [ceilingRef] = usePlane(() => ({
    rotation: [Math.PI / 2, 0, 0],
    position: [0, 8, 0],
  }));

  // Hanging bulb
  const bulbRef = useRef();
  useFrame((state) => {
    if (bulbRef.current) {
      //@ts-ignore
      bulbRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02 + 7;
      //@ts-ignore
      bulbRef.current.position.z =
        Math.sin(state.clock.elapsedTime * 2) * 0.015 + 0.1;
    }
  });

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
        <meshStandardMaterial attach="material" map={floorTexture}  />
      </mesh>

      {/* Walls */}
      <mesh ref={wallRef1}>
        <boxGeometry args={[100, 25, 1]} />
        {/* @ts-ignore */}
        <meshStandardMaterial
          map={wallTexture}
          emissive="#000000"
          color="#888888"
        />
      </mesh>
      <mesh ref={wallRef2}>
        <boxGeometry args={[100, 25, 1]} />
        <meshStandardMaterial
          map={wallTexture}
          emissive="#000000"
          color="#888888"
        />
      </mesh>
      <mesh ref={wallRef3}>
        <boxGeometry args={[100, 25, 1]} />
        {/* @ts-ignore */}
        <meshStandardMaterial
          map={wallTexture}
          emissive="#000000"
          color="#888888"
        />
      </mesh>
      <mesh ref={wallRef4}>
        <boxGeometry args={[100, 25, 1]} />
        {/* @ts-ignore */}
        <meshStandardMaterial
          map={wallTexture}
          emissive="#000000"
          color="#888888"
        />
      </mesh>

      {/* Ceiling */}
      <mesh ref={ceilingRef}>
        <planeGeometry attach="geometry" args={[100, 100]} />
        <ambientLight intensity={0.1} />
        {/* @ts-ignore */}
        <meshStandardMaterial attach="material" map={ceilingTexture} />
      </mesh>

      {/* Hanging bulb */}
      <group ref={bulbRef} position={[0, 80, 0]} scale={[4,3,2.7]}>
        <pointLight position={[0,-0.5,0]} intensity={30} distance={9} color="#FFFFE0" />
        <group>
          {/* Glass bulb part */}
          <mesh>
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshPhysicalMaterial
              color="#FFFFE0"
              emissive="#FFFFE0"
              emissiveIntensity={2}
              transparent={true}
              opacity={0.9}
              roughness={0.1}
              metalness={0.1}
            />
          </mesh>

          {/* Bulb base (narrower part) */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.03, 0.05, 0.08, 32]} />
            <meshStandardMaterial
              color="#CCCCCC"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Bulb screw base */}
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.06, 32]} />
            <meshStandardMaterial
              color="#BBBBBB"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        </group>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
    </>
  );
};
