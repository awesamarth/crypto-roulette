import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3, Quaternion } from 'three';
import { useCompoundBody } from '@react-three/cannon';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from "three"
import { NUM_PLAYERS } from '@/constants';

const CAMERA_DISTANCE = 5;
const CAMERA_HEIGHT = 2;
const HEAD_OFFSET = 0.4;
const TABLE_RADIUS = 8; 

export const Player = ({ userId, whoseTurn, position, isMe, playerCount, playerIndex }: { whoseTurn: any, userId: any, position: any, isMe: boolean, remoteRef: any, playerCount: number, playerIndex: number }) => {
  const { camera } = useThree();
  const [ref, api] = useCompoundBody(() => ({
    mass: 2,
    type: 'Static',
    position: position,
    shapes: [
      { type: 'Cylinder', position: [0, 0, 0], args: [0.5, 0.5, 2] },
      { type: 'Sphere', position: [0, 0.8 + HEAD_OFFSET, 0], args: [0.4] },
    ],
  }));

  // console.log("the user id is: ", userId)
  // console.log("isme? ", isMe)
  // const [initialCameraRotation, setInitialCameraRotation] = useState(new Quaternion());
  const controlsRef = useRef();
  const initialRotationSet = useRef(false);

  useEffect(() => {
    
    if (isMe && !initialRotationSet.current) {
      // console.log("this happened right here")
      const angle = (playerIndex / playerCount) * Math.PI * 2;
      const initialPosition = new Vector3(
        TABLE_RADIUS * Math.cos(angle),
        CAMERA_HEIGHT,
        TABLE_RADIUS * Math.sin(angle)
      );
      const lookAtCenter = new Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(initialPosition, new Vector3(0, 1, 0), new Vector3(0, 1, 0))
      );
      // setInitialCameraRotation(lookAtCenter);
      camera.quaternion.copy(lookAtCenter);
      

      initialRotationSet.current = true;
    }

    if (isMe && playerCount==NUM_PLAYERS){
      const angle = (playerIndex / playerCount) * Math.PI * 2;
      const initialPosition = new Vector3(
        TABLE_RADIUS * Math.cos(angle),
        CAMERA_HEIGHT,
        TABLE_RADIUS * Math.sin(angle)
      );
      const lookAtCenter = new Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(initialPosition, new Vector3(0, 1, 0), new Vector3(0, 1, 0))
      );
      // setInitialCameraRotation(lookAtCenter);
      camera.quaternion.copy(lookAtCenter);
    }
  }, [isMe, playerIndex, playerCount]);

  useEffect(() => {
    const angle = (playerIndex / playerCount) * Math.PI * 2;
    const newPosition = [
      TABLE_RADIUS * Math.cos(angle),
      1,
      TABLE_RADIUS * Math.sin(angle),
    ];
    api.position.set(newPosition[0], newPosition[1], newPosition[2]);
  }, [playerCount, playerIndex, api.position]);

  const pos = useRef(position);
  useEffect(() => {
    api.position.subscribe((p) => (pos.current = p));
  }, [api.position]);

  useFrame(() => {
    if (isMe) {
      const playerPosition = new Vector3(...pos.current);
      if (whoseTurn === userId) {
        // Zoom in on the remote when it's this player's turn
        const angle = Math.atan2(playerPosition.z, playerPosition.x);
        const remotePosition = new Vector3(
          (TABLE_RADIUS - 0.5) * Math.cos(angle),
          1.6, // Slightly above the table
          (TABLE_RADIUS - 0.5) * Math.sin(angle)
        );

        // Set camera to look at the remote
        const cameraPosition = remotePosition.clone().add(new Vector3(0, 1, 0).applyAxisAngle(new Vector3(0, 1, 0), angle));
        camera.position.lerp(cameraPosition, 0.1);
        // camera.lookAt(remotePosition);
      } else {
        const cameraOffset = new Vector3(0, CAMERA_HEIGHT, CAMERA_DISTANCE);  

        // Use the current camera quaternion instead of the initial one
        cameraOffset.applyQuaternion(camera.quaternion);
        camera.position.copy(playerPosition).add(cameraOffset);

      }
    }
  });

  useEffect(()=>{
    console.log("re rendered")
  },[])

  return (
    <>
      {isMe && <PointerLockControls ref={controlsRef} />}
      <group ref={ref}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 1.5, 20]} />
          <meshStandardMaterial color={isMe ? "green" : "blue"} />
        </mesh>
        <mesh position={[0, 0.8 + HEAD_OFFSET, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        {userId && whoseTurn && userId === whoseTurn && (
          <pointLight position={[0, 1, 0]} intensity={100} />
        )}
        {userId}
      </group>
    </>
  );
};