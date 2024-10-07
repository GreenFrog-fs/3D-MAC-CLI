import { create } from "zustand";
import { findUser } from "../apiActions/findUser";
import { saveUser } from "../apiActions/saveUser";
import { getDistance } from "../calculations/getDistance";

const useUserStore = create((set, get) => ({
  id: window?.Telegram?.WebApp?.initDataUnsafe?.user?.id
    ? "" + window?.Telegram?.WebApp?.initDataUnsafe?.user?.id
    : "123",
  user: null,
  position: [],
  positions: [],
  prevPos: [],
  closestChest: null,
  avatar_src: "/models/4.glb",

  getUser: async () => {
    const { id } = get();
    try {
      const user = await findUser(id);
      set({ user });
    } catch (error) {
      const user = await saveUser(id);
      set({ user });
    }
  },
  setPosition: (position) => {
    const now = get().position;
    if (now.length == 0) {
      set({ position });
      set({ positions: [...get().positions, position] });
    }
    if (getDistance(now, position[0], position[1]) > 1) {
      set({ position });
      set({ positions: [...get().positions, position] });
    }
    set({ prevPos: now });
  },
  setClosestChest: (chest) => {
    set({ closestChest: chest });
  },
  setAvatarSrc: (src) => {
    set({ avatar_src: src });
  },
}));

export default useUserStore;
