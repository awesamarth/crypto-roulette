import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

const usePlayerCamera = (playerPosition: typeof Vector3, isMe: boolean) => {
  const { camera } = useThree();
  const CAMERA_DISTANCE = 5;
  const CAMERA_HEIGHT = 2;

  useEffect(() => {
    if (isMe) {
      const cameraOffset = new  Vector3(0, CAMERA_HEIGHT, CAMERA_DISTANCE);
      cameraOffset.applyQuaternion(camera.quaternion);
      camera.position.copy(playerPosition).add(cameraOffset);
      camera.lookAt(playerPosition);
    }
  }, [camera, playerPosition, isMe]);
};

export default usePlayerCamera;
