import axios from "axios";
import { url } from "../constants";

export function findUser(id) {
  return axios
    .post(`${url}/user/find`, {
      id: id,
    })
    .then((res) => res.data);
}
