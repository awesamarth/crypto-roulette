// In Remote.tsx

import { forwardRef, useState, useRef, useEffect } from "react";
import { useBox } from "@react-three/cannon";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Remote = forwardRef(({ 
  position, 
  rotation, 
  onDetonate, 
  onPass,
  isActive,
  playerCount,
  playerIndex
}: { 
  position: [number, number, number],
  rotation: [number, number, number], 
  onDetonate: () => void,
  onPass: () => void,
  isActive: boolean,
  playerCount: number,
  playerIndex: number
}, ref) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [boxRef, api] = useBox(() => ({
    mass: 1,
    position: position,
    args: [0.3, 0.05, 0.2],
  }), ref);
  const detonateTextRef = useRef<any>(null);
  const passTextRef = useRef<any>(null);

  useFrame(({ camera }) => {
    if (detonateTextRef.current) {
      detonateTextRef.current.quaternion.copy(camera.quaternion);
    }
    if (passTextRef.current) {
      passTextRef.current.quaternion.copy(camera.quaternion);
    }
  });

  useEffect(() => {
    api.position.set(...position);
    api.rotation.set(...rotation);
  }, [api, position, rotation]);

  const handleClick = (action: 'detonate' | 'pass') => {
    if (isActive) {
      if (action === 'detonate') {
        onDetonate();
      } else {
        onPass();
      }
    }
  };

  const scale = isActive ? 2 : 1;

  return (
    <group ref={boxRef} scale={scale}>
      <mesh>
        <boxGeometry args={[0.3, 0.05, 0.2]} />
        <meshStandardMaterial color={isActive ? "lightgray" : "gray"} />
      </mesh>
      
      {/* Buttons Container */}
      <group position={[0, 0.03, 0]}>
        {/* Detonate Button */}
        <group position={[0.05, 0, 0]}>
          <mesh 
            onPointerOver={() => setHovered('detonate')}
            onPointerOut={() => setHovered(null)}
            onClick={() => handleClick('detonate')}
          >
            <cylinderGeometry args={[0.03, 0.03, 0.01, 16]} />
            <meshStandardMaterial color={hovered === 'detonate' && isActive ? "red" : "darkred"} />
          </mesh>
          <group ref={detonateTextRef}>
            <Text position={[0, 0.02, 0]} fontSize={0.02} color="white" anchorX="center" anchorY="middle">
              Detonate
            </Text>
          </group>
        </group>

        {/* Pass Button */}
        <group position={[-0.05, 0, 0]}>
          <mesh 
            onPointerOver={() => setHovered('pass')}
            onPointerOut={() => setHovered(null)}
            onClick={() => handleClick('pass')}
          >
            <cylinderGeometry args={[0.03, 0.03, 0.01, 16]} />
            <meshStandardMaterial color={hovered === 'pass' && isActive ? "green" : "darkgreen"} />
          </mesh>
          <group ref={passTextRef}>
            <Text position={[0, 0.02, 0]} fontSize={0.02} color="white" anchorX="center" anchorY="middle">
              Pass
            </Text>
          </group>
        </group>
      </group>
    </group>
  );
});

// The Table.tsx component remains the same as in the previous artifact