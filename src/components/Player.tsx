import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useCompoundBody } from '@react-three/cannon';
import { PointerLockControls } from '@react-three/drei';

const CAMERA_DISTANCE = 5;
const CAMERA_HEIGHT = 2;
const HEAD_OFFSET = 0.4;

export const Player = ({ initialPosition, isMyTurn, isMe }:{initialPosition:any, isMyTurn:boolean, isMe:boolean}) => {
  const { camera } = useThree();
  const [ref, api] = useCompoundBody(() => ({
    mass: 1,
    type: 'Dynamic',
    position: initialPosition,
    shapes: [
      { type: 'Cylinder', position: [0, 0, 0], args: [0.3, 0.3, 1.2] },
      { type: 'Sphere', position: [0, 0.8 + HEAD_OFFSET, 0], args: [0.4] },
    ],
  }));

  const pos = useRef([0, 0, 0]);
  useEffect(() => {
    api.position.subscribe((p) => (pos.current = p));
  }, [api.position]);

  const controlsRef = useRef();

  useEffect(() => {
      // Calculate the direction from the player to the center
      const directionToCenter = new Vector3(0, 0, 0).sub(new Vector3(...initialPosition)).normalize();
      
      // Set the initial camera position
      const cameraOffset = new Vector3(0, CAMERA_HEIGHT, CAMERA_DISTANCE);
      camera.position.copy(new Vector3(...initialPosition)).add(cameraOffset);
      
      // Make the camera look at the center
      camera.lookAt(0, CAMERA_HEIGHT, 0);
      
      // Update the PointerLockControls to match the new camera orientation
      if (controlsRef.current) {
        //@ts-ignore
        controlsRef.current.getObject().rotation.copy(camera.rotation);
      }
    
  }, [camera, initialPosition, isMe]);

  useFrame(() => {
      const playerPosition = new Vector3(pos.current[0], pos.current[1], pos.current[2]);
      const cameraOffset = new Vector3(0, CAMERA_HEIGHT, CAMERA_DISTANCE);
      cameraOffset.applyQuaternion(camera.quaternion);
      camera.position.copy(playerPosition).add(cameraOffset);
    
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      <group ref={ref}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 1.2, 16]} />
          <meshStandardMaterial color={isMe ? "green" : "blue"} />
        </mesh>
        <mesh position={[0, 0.8 + HEAD_OFFSET, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>
    </>
  );
};