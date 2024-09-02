"use client"

import { NearestFilter, TextureLoader, RepeatWrapping } from "three";
let floorTexture
let wallTexture
let ceilingTexture
let tableTexture
if (typeof window !== "undefined") {
    // Only load textures if we're in a browser environment
    const loader = new TextureLoader();
    floorTexture = loader.load("/floor.png");

  
    floorTexture.magFilter = NearestFilter;

    floorTexture.wrapS = RepeatWrapping
    floorTexture.wrapT = RepeatWrapping
    // roadTexture.repeat.set(10,10)

    wallTexture = loader.load("/wall.png")
    wallTexture.magFilter = NearestFilter
    wallTexture.wrapS = RepeatWrapping
    wallTexture.wrapT = RepeatWrapping

    ceilingTexture=loader.load("/ceiling.png")
    ceilingTexture.magFilter = NearestFilter
    ceilingTexture.wrapS = RepeatWrapping
    ceilingTexture.wrapT = RepeatWrapping

    tableTexture = loader.load("/table.png")
    // tableTexture.magFilter = NearestFilter






    
  }

  

  export { floorTexture, wallTexture, ceilingTexture, tableTexture };
