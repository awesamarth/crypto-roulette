import { useCylinder } from "@react-three/cannon";
import { useMemo } from "react";

export const Table = ({ radius }: { radius: number }) => {
  // Tabletop
  const [topRef] = useCylinder(() => ({
    type: "Static",
    position: [0, 1.5, 0], // Elevate the tabletop
    args: [radius, radius, 0.2, 32], // Thin circular tabletop
  }));

  // Legs
  const legHeight = 1.5;
  const legRadius = 0.2;
  const legDistance = radius - legRadius; // Distance from the center to the edge of the table

  // Memoize leg positions to avoid recalculating on each render
  const legPositions = useMemo(() => [
    [legDistance * Math.cos(Math.PI / 4), legHeight / 2, legDistance * Math.sin(Math.PI / 4)], // front-left
    [legDistance * Math.cos(-Math.PI / 4), legHeight / 2, legDistance * Math.sin(-Math.PI / 4)], // front-right
    [legDistance * Math.cos(3 * Math.PI / 4), legHeight / 2, legDistance * Math.sin(3 * Math.PI / 4)], // back-left
    [legDistance * Math.cos(-3 * Math.PI / 4), legHeight / 2, legDistance * Math.sin(-3 * Math.PI / 4)], // back-right
  ], [legDistance, legHeight, legRadius]);

  return (
    <group>
      {/* Circular Tabletop */}
      <mesh ref={topRef}>
        <cylinderGeometry args={[radius, radius, 0.2, 32]} />
        <meshStandardMaterial color="#663300" />
        <ambientLight intensity={0.3} />
        </mesh>

      {/* Legs */}
      {legPositions.map((position, index) => (
        <mesh key={index} position={position}>
          <cylinderGeometry args={[legRadius, legRadius, legHeight, 32]} />
          <meshStandardMaterial color="#4D2600" />
        </mesh>
      ))}
    </group>
  );
};
