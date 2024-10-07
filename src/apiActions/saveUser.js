import axios from "axios";
import { url } from "../constants";

export function saveUser(id) {
  return axios
    .post(`${url}/user/save`, {
      id: id,
    })
    .then((res) => res.data);
}
