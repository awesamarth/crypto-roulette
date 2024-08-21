import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3, Quaternion } from 'three';
import { useCompoundBody } from '@react-three/cannon';
import { PointerLockControls } from '@react-three/drei';

const CAMERA_DISTANCE = 5;
const CAMERA_HEIGHT = 2;
const HEAD_OFFSET = 0.4;

export const Player = ({userId, whoseTurn, position, isMe }: { whoseTurn:any, userId:any, position: any, isMe: boolean }) => {
  const { camera } = useThree();
  const [ref, api] = useCompoundBody(() => ({
    mass: 2,
    type: 'Dynamic',
    position: position,
    shapes: [
      { type: 'Cylinder', position: [0, 0, 0], args: [0.5, 0.5, 2] },
      { type: 'Sphere', position: [0, 0.8 + HEAD_OFFSET, 0], args: [0.4] },
    ],
  }));

  const [cameraRotation, setCameraRotation] = useState(new Quaternion());
  const controlsRef = useRef();

  useEffect(() => {
    if (isMe) {
      const cameraOffset = new Vector3(0, CAMERA_HEIGHT, CAMERA_DISTANCE);
  
      console.log('Camera Offset:', cameraOffset);
      console.log('Camera Position:', camera.position);
  
      // Set initial camera position relative to circle center
  
      // Make the camera look at the center of the circle
  
      // Update the camera rotation to match the initial orientation
      setCameraRotation(camera.quaternion);
  
      if (controlsRef.current) {
        //@ts-ignore
        controlsRef.current.getObject().rotation.copy(camera.rotation);
      }
    }
  }, [isMe, position, camera]);


  const pos = useRef(position);
  useEffect(() => {
    api.position.subscribe((p) => (pos.current = p));
  }, [api.position]);

  useFrame(() => {
    const playerPosition = new Vector3(...pos.current);
    if (isMe) {
      const cameraOffset = new Vector3(0, CAMERA_HEIGHT, CAMERA_DISTANCE);
      cameraOffset.applyQuaternion(cameraRotation);
      camera.position.copy(playerPosition).add(cameraOffset);
      camera.quaternion.copy(cameraRotation);
    }
  });

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
