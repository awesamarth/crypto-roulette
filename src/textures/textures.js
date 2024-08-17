"use client"

import { NearestFilter, TextureLoader, RepeatWrapping } from "three";
let roadTexture
if (typeof window !== "undefined") {
    // Only load textures if we're in a browser environment
    const loader = new TextureLoader();
    roadTexture = loader.load("/road.png");

  
    roadTexture.magFilter = NearestFilter;

    roadTexture.wrapS = RepeatWrapping
    roadTexture.wrapT = RepeatWrapping
    // roadTexture.repeat.set(10,10)
  }

  export { roadTexture };
