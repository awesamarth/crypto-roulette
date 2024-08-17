import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3, Euler } from 'three'
import { useSphere } from '@react-three/cannon'
import { useKeyboard } from '@/hooks/useKeyboard'
import { PointerLockControls } from '@react-three/drei'

const CAMERA_DISTANCE = 5;
const CAMERA_HEIGHT = 2;

export const Player =  ({ initialPosition }: { initialPosition: any }) => {
  
  const { camera } = useThree()
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: initialPosition,
  }))
  
  const vel = useRef(initialPosition)
  useEffect(() => {
    api.velocity.subscribe((v) => (vel.current = v))
  }, [api.velocity])

  const pos = useRef([0, 1, 0])
  useEffect(() => {
    api.position.subscribe((p) => (pos.current = p))
  }, [api.position])

  const controlsRef = useRef()

  useFrame(() => {
    const playerPosition = new Vector3(pos.current[0], pos.current[1], pos.current[2])
  
    // Calculate camera position
    const cameraOffset = new Vector3(1, CAMERA_HEIGHT, CAMERA_DISTANCE);
    cameraOffset.applyQuaternion(camera.quaternion);
    camera.position.copy(playerPosition).add(cameraOffset);
    


    const direction = new Vector3()


    direction
      .normalize()
      .applyEuler(camera.rotation)



  })

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      <mesh ref={ref}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </>
  )
}