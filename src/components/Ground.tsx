'use client'

import { usePlane } from "@react-three/cannon"
import {RepeatWrapping, NearestFilter} from "three"
//@ts-ignore
import {roadTexture } from "@/textures/textures.js"
export const Ground = () =>{
    const [ref] = usePlane(()=>({
        rotation:[-Math.PI/2,0,0] , position:[0,-0.5,0]
    }))






    return (
        <mesh ref={ref}>
            <planeGeometry attach="geometry" args={[100,100]} />
            {/* @ts-ignore */}
            <meshStandardMaterial  attach="material" map={roadTexture} />

        </mesh>


    )
}