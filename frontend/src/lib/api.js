import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;
export const api = axios.create({ baseURL: API, timeout: 60000 });

export async function getJSON(path) {
  const { data } = await api.get(path);
  return data;
}
export async function postJSON(path, body) {
  const { data } = await api.post(path, body);
  return data;
}
