"use client";

import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Ground } from "@/components/Ground";
import { Player } from "@/components/Player";

export default function Home() {
  const PLAYER_COUNT = 8;
  const TABLE_RADIUS = 8;

  const playerPositions = Array.from({ length: PLAYER_COUNT }, (_, i) => {
    const angle = (i / PLAYER_COUNT) * Math.PI * 2;
    return [TABLE_RADIUS * Math.cos(angle), 1, TABLE_RADIUS * Math.sin(angle)];
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* <div>Outside canvas</div> */}

      <div className="h-screen w-full">
        <Canvas className="border-2 ">
          <Sky sunPosition={[0, 100, 100]} />
          <ambientLight intensity={0.5} />
          <Physics>
            {/* <Player initialPosition={position} /> */}
            {playerPositions.map((position, index) => (
              <Player key={index}
              initialPosition={position}
              />
            ))}
            <Ground />
          </Physics>
        </Canvas>
        <div className="  flex items-center justify-center absolute top-[46%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <span>.</span>
        </div>{" "}
      </div>
    </main>
  );
}
