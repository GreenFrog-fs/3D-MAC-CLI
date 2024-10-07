import axios from "axios";
import { url } from "../constants";

export function deactivateChest(chest_id, user_id) {
  return axios
    .patch(`${url}/chest/deactivate`, {
      user_id,
      chest_id,
    })
    .then((res) => res.data);
}
