"use client"

import { NearestFilter, TextureLoader, RepeatWrapping } from "three";
let floorTexture
if (typeof window !== "undefined") {
    // Only load textures if we're in a browser environment
    const loader = new TextureLoader();
    floorTexture = loader.load("/floor.png");

  
    floorTexture.magFilter = NearestFilter;

    floorTexture.wrapS = RepeatWrapping
    floorTexture.wrapT = RepeatWrapping
    // roadTexture.repeat.set(10,10)
  }

  export { floorTexture };
