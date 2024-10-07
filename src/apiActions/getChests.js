import axios from "axios";
import { url } from "../constants";

export function getChests() {
  return axios.get(`${url}/chest/all`).then((res) => res.data);
}
