"use client";

import { useCallback, useEffect, useState } from "react";


function actionByKey(key) {
  const keyActionMap = {
    KeyW: "moveForward",
    KeyS: "moveBackward",
    KeyA: "moveLeft",
    KeyD: "moveRight",
    Space: "jump",
    Digit1: "dirt",
    Digit2: "grass",
    Digit3: "glass",
    Digit4: "wood",
    Digit5: "log",
    ShiftLeft:"sprint"
    

  };

  return keyActionMap[key];
}

export const useKeyboard = () => {
  const [actions, setActions] = useState({

    dirt: false,
    glass: false,
    grass: false,
    wood: false,
    log: false,
  });

  const handleKeyDown = useCallback((e) => {
    const action = actionByKey(e.code);
    if (action) {
      setActions((prev) => {
        
        return { ...prev, [action]: true };
      });
    }
  }, []);

  const handleKeyUp = useCallback((e) => {
    const action = actionByKey(e.code);
    if (action) {
      setActions((prev) => {
        return { ...prev, [action]: false };
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return actions
};
