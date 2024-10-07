import { create } from "zustand";
import { getChests } from "../apiActions/getChests";

const useChestsStore = create((set, get) => ({
  chests: [],
  startChestsUpdate: async () => {
    try {
      const chests = await getChests();
      set({ chests });
      setInterval(() => {
        getChests().then((chests) => set({ chests }));
      }, 10000);
    } catch (error) {}
  },
  deleteChestFromFront: (id) => {
    set({ chests: get().chests.filter((chest) => chest.id != id) });
  },
}));

export default useChestsStore;
