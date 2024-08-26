import { create } from "zustand";

export const useStore = create((set) => ({
  username: "",
  setUserName: (x) => {
    set(() => ({
      username: x,
    }));
    console.log("username set")
  },
}));
