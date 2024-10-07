import axios from "axios";
import { create } from "zustand";
import { url } from "../constants";
import useUserStore from "./userStore";

const useShopStore = create((set, get) => ({
  avatars: [],
  getAvatars: async () => {
    const { id } = useUserStore.getState();
    const avatars = await axios
      .get(`${url}/avatars/all`)
      .then((res) => res.data);
    const opened = await axios
      .post(`${url}/avatars/opened`, { userid: id })
      .then((res) => res.data.map((row) => row.avatar));
    const openedSet = new Set(opened.map((avatar) => avatar.id));
    const updatedAvatars = avatars.map((avatar) => ({
      ...avatar,
      opened: openedSet.has(avatar.id),
    }));
    set({ avatars: updatedAvatars });
  },

  buyAvatar: async (avatar) => {
    const { user, getUser } = useUserStore.getState();
    if (user.points >= avatar.price) {
      await axios.post(`${url}/avatars/buy`, {
        userid: user.id,
        avatarid: avatar.id,
      });
      await get().getAvatars();
      await getUser();
    } else {
      alert("не хватает монет");
    }
  },
}));

export default useShopStore;
