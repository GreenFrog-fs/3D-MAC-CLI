import { create } from "zustand";

const usePageStore = create((set, get) => ({
  page: "map",
  showClicker: false,
  setPage: (page) => {
    set({ page });
  },
  activateClicker: () => {
    set({ showClicker: true });
  },

  hideClicker: () => {
    set({ showClicker: false });
  },
}));

export default usePageStore;
