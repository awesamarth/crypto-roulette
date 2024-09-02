
import { useCylinder } from "@react-three/cannon";
import { useMemo, useRef } from "react";
import { Remote } from "./Remote";
//@ts-ignore
import { tableTexture } from "@/textures/textures";
import { Color } from 'three'

export const Table = ({
  radius,
  playerCount,
  onDetonate,
  onPass,
  whoseTurn,
  playersArray,
}: {
  radius: number;
  playerCount: number;
  onDetonate: () => void;
  onPass: () => void;
  whoseTurn: string;
  playersArray: string[];
}) => {
  // Tabletop
  const [topRef] = useCylinder(() => ({
    type: "Static",
    position: [0, 1.5, 0], // Elevate the tabletop
    args: [radius, radius, 0.2, 32], // Thin circular tabletop
  }));

  // Remote reference
  const remoteRefs = useRef([]);

  // Legs
  const legHeight = 1.5;
  const legRadius = 0.2;
  const legDistance = radius - legRadius; // Distance from the center to the edge of the table

  // Memoize leg positions to avoid recalculating on each render
  const legPositions = useMemo(
    () => [
      [
        legDistance * Math.cos(Math.PI / 4),
        legHeight / 2,
        legDistance * Math.sin(Math.PI / 4),
      ], // front-left
      [
        legDistance * Math.cos(-Math.PI / 4),
        legHeight / 2,
        legDistance * Math.sin(-Math.PI / 4),
      ], // front-right
      [
        legDistance * Math.cos((3 * Math.PI) / 4),
        legHeight / 2,
        legDistance * Math.sin((3 * Math.PI) / 4),
      ], // back-left
      [
        legDistance * Math.cos((-3 * Math.PI) / 4),
        legHeight / 2,
        legDistance * Math.sin((-3 * Math.PI) / 4),
      ], // back-right
    ],
    [legDistance, legHeight, legRadius]
  );

  const remotePositions = useMemo(() => {
    return playersArray.map((_, i) => {
      const angle = (i / playersArray.length) * Math.PI * 2;
      const x = (radius - 0.5) * Math.cos(angle);
      const z = (radius - 0.5) * Math.sin(angle);
      return [x, 1.6, z] as [number, number, number];
    });
  }, [radius, playersArray]);
  const remoteRotations = useMemo(() => {
    return playersArray.map((_, i) => {
      const angle = (i / playersArray.length) * Math.PI * 2;
      return [0, -angle + Math.PI, 0] as [number, number, number];
    });
  }, [playersArray]);
  
  const hueShift = new Color(2.1, 0.8, 0.65)


  return (
    <group>
      {/* Circular Tabletop */}
      <mesh ref={topRef}>
        
        <cylinderGeometry args={[radius, radius, 0.2, 32]} />
        {/* @ts-ignore */}
        <meshStandardMaterial attach="material" map={tableTexture} color={hueShift}  />
        <ambientLight intensity={1}  />
      </mesh>

      {/* Legs */}
      {legPositions.map((position, index) => (
        <mesh key={index} position={position}>
          <cylinderGeometry args={[legRadius, legRadius, legHeight, 32]} />
          {/* @ts-ignore */}
          <meshStandardMaterial attach="material" map={tableTexture} color={hueShift} />
          </mesh>
      ))}
      {playersArray.map((playerId, index) => {
        const isActive = playerId === whoseTurn;
        const position = remotePositions[index];
        const rotation = remoteRotations[index];
        return (
          <Remote
            key={playerId}
            position={position}
            rotation={rotation}
            onDetonate={onDetonate}
            onPass={onPass}
            isActive={isActive}
            ref={(el) => {
              // @ts-ignore
              remoteRefs.current[playerId] = el;
              if (isActive) {
                console.log("Setting active remote ref:", el);
              }
            }}
            playerCount={playersArray.length}
            playerIndex={index}
          />
        );
      })}
    </group>
  );
};
